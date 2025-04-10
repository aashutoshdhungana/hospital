import { Gender } from "../../../types/UserInfo";

export default interface Patient {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    emergencyContactPerson: string;
    emergencyContactNumber: string;
    gender: Gender;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    dateOfBirth: string;
}

