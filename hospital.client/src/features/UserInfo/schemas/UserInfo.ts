export enum Gender {
	Male = 0,
	Female = 1,
	Other = 2
}

export interface UserInfo {
	email?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	phoneNumber: string;
	gender: Gender;
	street?: string;
	city?: string;
	state?: string;
	country?: string;
	dateOfBirth: string;
    id: number;
	createdBy?: string;
	createdAt: string;
	updatedBy?: string;
	updatedAt?: string;
}
