import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
				if (response.data) {
					setUser(response.data.userInfo);
					setPermissions([...response.data.permissions]);
					setRoles([...response.data.roles]);
					setIsAuthenticated(true);
				}
			} catch (error) {
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
			const response = await api.post<AuthResponse>("/api/login", credentials);
			setUser(response.data.userInfo);
			setPermissions(response.data.permissions);
			setRoles(response.data.roles);
			setIsAuthenticated(true);
		} catch (error) {
			setUser(null);
			setPermissions([]);
			setRoles([]);
			setIsAuthenticated(false);
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

// Custom hook for authentication
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
