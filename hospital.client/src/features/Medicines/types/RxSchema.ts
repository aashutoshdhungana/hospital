import { z } from 'zod';

export const RxInfoSchema = z.object({
	name: z.string().min(1, "Name is required"),
	type: z.string().min(1, "Type is required"),
	remarks: z.string().optional(),
	diagnosisId: z.string().min(1, "Diagnosis is required"),
});

export type RxInfoForm = z.infer<typeof RxInfoSchema>;
