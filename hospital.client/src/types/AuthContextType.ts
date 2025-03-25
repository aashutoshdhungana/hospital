import { UserInfo } from "./UserInfo";
import { LoginCredentials } from "./LoginCredentials";

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserInfo | null;
    permissions: string[];
    roles: string[];
    login: (credentials: LoginCredentials) => Promise<void>;
}