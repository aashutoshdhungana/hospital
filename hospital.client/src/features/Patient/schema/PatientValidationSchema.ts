import { z } from "zod";
import { Gender } from "../../../types/UserInfo";

const PatientFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),

  middleName: z
    .string()
    .max(50, "Middle name cannot exceed 50 characters")
    .optional(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Email address is invalid"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),

  emergencyContactPerson: z
    .string()
    .min(1, "Emergency contact person is required"),

  emergencyContactNumber: z
    .string()
    .min(1, "Emergency contact number is required"),

  gender: z.enum(["0", "1", "2"], {
    message: "Invalid gender selection",
  }),

  street: z
    .string()
    .min(1, "Street is required")
    .max(100, "Street name cannot exceed 100 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City name cannot exceed 50 characters"),

  state: z
    .string()
    .min(1, "State is required")
    .max(50, "State name cannot exceed 50 characters"),

  country: z
    .string()
    .min(1, "Country is required")
    .max(50, "Country name cannot exceed 50 characters"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format (expected YYYY-MM-DD)",
    }),
});

export type PatientFormValues = z.infer<typeof PatientFormSchema>;

export default PatientFormSchema 