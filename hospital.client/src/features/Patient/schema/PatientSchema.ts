// schemas.ts
import { z } from "zod";
export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2
}

export const phoneSchema = z.object({
	phoneNumber: z.string().min(10, "Enter a valid phone number"),
});

export const createUserSchema = z.object({
	firstName: z.string().min(1),
	middleName: z.string().optional(),
	lastName: z.string().min(1),
	email: z.string().email(),
	phoneNumber: z.string().min(10),
	gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Invalid gender selection" }) }),
	street: z.string(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	dateOfBirth: z.string(), // you can refine if needed
});

export const createPatientSchema = z.object({
	emergencyContactPerson: z.string().min(1, "Required"),
	emergencyContactNumber: z.string().min(7, "Invalid contact number"),
});

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