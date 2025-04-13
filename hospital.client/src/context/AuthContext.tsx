import { createContext, useEffect, useState, ReactNode } from "react";
import { UserInfo } from "@/features/UserInfo/schemas/UserInfo"; // Update the path to the correct location of UserInfo
import { AuthContextType } from "../types/AuthContextType";


import { LoginCredentials } from "../types/LoginCredentials";
import { AuthResponse } from "../types/AuthResponse";
import api from "../utils/Api";
import Loading from "../components/Loading/Loading";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockResponse ={
	status: 200,
	data: {
		"userInfo": {
			"id": 1,
			"email": "admin@hospital.com",
			"firstName": "Hospital123",
			"middleName": "",
			"lastName": "Admin",
			"phoneNumber": "1234567890",
			"gender": 0,
			"street": "123 Admin Street",
			"city": "Admin City Test",
			"state": "Admin State",
			"country": "USA",
			"dateOfBirth": "2025-04-08T00:00:00",
			"createdBy": "",
			"createdAt": "2025-04-12T11:15:36.15795Z",
			"updatedBy": "Hospital123  Admin",
			"updatedAt": "2025-04-12T21:40:47.902711Z"
		},
		"permissions": [],
		"roles": [
			"Admin"
		]
	}
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [permissions, setPermissions] = useState<string[]>([]);
	const [roles, setRoles] = useState<string[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [activeRole, setActiveRoleState] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// const response = await api.get<AuthResponse>("/api/login/checkauth");
				const response = mockResponse
				if (response.data && response.data.userInfo) {
					setUser(response.data.userInfo);
					setPermissions(response.data.permissions || []);
					setRoles(response.data.roles || []);
					setIsAuthenticated(true);
					setActiveRoleState(localStorage.getItem(`${response.data.userInfo.id}-activeRole`) || response.data.roles[0] || "");
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
				setActiveRoleState("");
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
			
			// const response = await api.post<AuthResponse>("/api/login", loginData);
			const response = mockResponse;
			
			if (response.data && response.data.userInfo) {
				setUser(response.data.userInfo);
				setPermissions(response.data.permissions || []);
				setRoles(response.data.roles || []);
				setIsAuthenticated(true);
				setActiveRoleState(localStorage.getItem(`${response.data.userInfo.id}-activeRole`) || response.data.roles[0] || "");
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
			setActiveRoleState("");
			throw error; // Re-throw to handle in the UI
		}
	};

	const setActiveRole = (role: string) => {
		if (roles.includes(role)) {
			setActiveRoleState(role);
			localStorage.setItem(`${user?.id}-activeRole`, role);
		} else {
			console.error(`Role ${role} is not valid for the current user.`);
		}
	}
	// Logout function
	const logOut = async () => {
		try {
			await api.post("/api/logout", {}, { withCredentials: true });
			setUser(null);
			setPermissions([]);
			setRoles([]);
			setIsAuthenticated(false);
			setActiveRoleState("");
		}
		catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, permissions, roles, login, isAuthenticated, activeRole, setActiveRole, logOut }}>
			{isLoading ? <Loading /> : children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
