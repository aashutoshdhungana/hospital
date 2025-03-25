export interface UserInfo {
    id: number;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
    street: string;
    city: string;
    state: string;
    country: string;
    dateOfBirth: string;
    createdBy: number;
    createdAt: string;
    updatedBy?: number | null;
    updatedAt?: string | null; 
  }
  
  export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2
  }