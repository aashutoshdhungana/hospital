import { UserInfo } from "@/features/UserInfo/schemas/UserInfo";

export interface AuthResponse {
	userInfo: UserInfo;
	permissions: string[];
	roles: string[];
}