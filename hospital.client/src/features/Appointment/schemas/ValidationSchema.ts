import { z } from "zod";

export const appointmentFormData = z.object({
  patientInfoId: z.number().int().positive(),
  doctorInfoId: z.number().int().positive(),
  appointmentDate: z.string().min(1, "Appointment date is required"),
});


export type AppointmentFormData = z.infer<typeof appointmentFormData>;
