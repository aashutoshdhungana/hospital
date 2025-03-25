import { UserInfo } from "./UserInfo";

export interface AuthResponse {
	userInfo: UserInfo;
	permissions: string[];
	roles: string[];
}