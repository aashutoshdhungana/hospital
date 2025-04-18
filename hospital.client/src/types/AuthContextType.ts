import { UserInfo } from "@/features/UserInfo/schemas/UserInfo";
import { LoginCredentials } from "./LoginCredentials";

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserInfo | null;
    permissions: string[];
    roles: string[];
    activeRole: string;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logOut: () => Promise<void>;
    setActiveRole: (role: string) => void;
}