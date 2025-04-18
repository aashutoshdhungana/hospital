// schemas.ts
import { z } from "zod";
export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2
}

export enum Specialization
{
	GeneralPhysician,       // 0
	Pediatrician,           // 1
	Gynecologist,           // 2
	GeneralSurgeon,         // 3
	Orthopedic,             // 4
	Cardiologist,           // 5
	Neurologist,            // 6
	Dermatologist,          // 7
	Psychiatrist,           // 8
	Radiologist,            // 9
	Anesthesiologist,       // 10
	Oncologist,             // 11
	ENTSpecialist,          // 12
	Nephrologist,           // 13
	Pulmonologist,          // 14
	Endocrinologist,        // 15
	Urologist,              // 16
	Ophthalmologist,        // 17
	Pathologist,            // 18
	Physiotherapist         // 19
}

export const specializations = [
	{ value: 0, label: "General Physician" },
	{ value: 1, label: "Pediatrician" },
	{ value: 2, label: "Gynecologist" },
	{ value: 3, label: "General Surgeon" },
	{ value: 4, label: "Orthopedic" },
	{ value: 5, label: "Cardiologist" },
	{ value: 6, label: "Neurologist" },
	{ value: 7, label: "Dermatologist" },
	{ value: 8, label: "Psychiatrist" },
	{ value: 9, label: "Radiologist" },
	{ value: 10, label: "Anesthesiologist" },
	{ value: 11, label: "Oncologist" },
	{ value: 12, label: "ENT Specialist" },
	{ value: 13, label: "Nephrologist" },
	{ value: 14, label: "Pulmonologist" },
	{ value: 15, label: "Endocrinologist" },
	{ value: 16, label: "Urologist" },
	{ value: 17, label: "Ophthalmologist" },
	{ value: 18, label: "Pathologist" },
	{ value: 19, label: "Physiotherapist" },
];

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

export const doctorSchema = z.object({
	medicalLicenseNumber: z.string().min(1),
	pastExperienceInYears: z.coerce.number().min(0),
	specialization: z.nativeEnum(Specialization)
});

export interface Doctor {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	gender: number;
	specialization: Specialization;
	medicalLicenseNumber: string;
	pastExperienceInYears: number;
};

