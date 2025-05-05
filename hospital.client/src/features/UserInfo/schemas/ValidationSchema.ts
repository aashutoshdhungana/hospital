import { z } from "zod";

export const UserInfoValidationSchema = z.object({
	email: z.string().email("Email address is invalid")
        .optional(),
	firstName: z.string()
        .min(1, "Required")
        .max(50, "First name cannot exceed 50 characters"),
	middleName: z.string().max(50, "Middle name cannot exceed 50 characters")
        .optional(),
	lastName: z.string()
        .min(1, "Required")
        .max(50, "Last name cannot exceed 50 characters"),
	phoneNumber: z.string()
		.min(1, "Required")
		.regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),
	gender: z.string(),
	street: z.string()
        .max(100, "Street name cannot exceed 100 characters") 
        .optional(),
	city: z.string()
        .max(50, "City name cannot exceed 50 characters")
        .optional(),
	state: z.string().max(50, "State name cannot exceed 50 characters")
        .optional(),
	country: z.string().max(50, "Country name cannot exceed 50 characters")
        .optional(),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type UserInfoFormData = z.infer<typeof UserInfoValidationSchema>