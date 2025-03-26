import { createContext, useEffect, useState, ReactNode } from "react";
import { UserInfo } from "../types/UserInfo";
import { AuthContextType } from "../types/AuthContextType";
import { LoginCredentials } from "../types/LoginCredentials";
import { AuthResponse } from "../types/AuthResponse";
import api from "../utils/Api";
import Loading from "../components/Loading/Loading";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [permissions, setPermissions] = useState<string[]>([]);
	const [roles, setRoles] = useState<string[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get<AuthResponse>("/api/login/checkauth");
				if (response.data && response.data.userInfo) {
					setUser(response.data.userInfo);
					setPermissions(response.data.permissions || []);
					setRoles(response.data.roles || []);
					setIsAuthenticated(true);
				} else {
					// If response is successful but no user data, treat as not authenticated
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch (error) {
				console.error("Authentication check failed:", error);
				setUser(null);
				setPermissions([]);
				setRoles([]);
				setIsAuthenticated(false);
			}
			finally {
				setIsLoading(false);
			}
		};
		checkAuth();
	}, []);

	const login = async (credentials: LoginCredentials) => {
		try {
			// Ensure the credentials match the expected format on the server
			const loginData = {
				username: credentials.username,
				password: credentials.password,
				rememberMe: credentials.rememberMe || false
			};
			
			console.log("Attempting login with:", { username: loginData.username, rememberMe: loginData.rememberMe });
			
			const response = await api.post<AuthResponse>("/api/login", loginData);
			
			if (response.data && response.data.userInfo) {
				setUser(response.data.userInfo);
				setPermissions(response.data.permissions || []);
				setRoles(response.data.roles || []);
				setIsAuthenticated(true);
				return true;
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (error) {
			console.error("Login failed:", error);
			setUser(null);
			setPermissions([]);
			setRoles([]);
			setIsAuthenticated(false);
			throw error; // Re-throw to handle in the UI
		}
	};

	// // Logout function
	// const logout = async () => {
	// 	await axios.post("/api/logout", {}, { withCredentials: true });
	// 	setUser(null);
	// 	setPermissions([]);
	// 	setRoles([]);
	// };

	return (
		<AuthContext.Provider value={{ user, permissions, roles, login, isAuthenticated }}>
			{isLoading ? <Loading /> : children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
