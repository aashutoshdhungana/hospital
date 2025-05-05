import { z } from 'zod';

export const diagnosisSchema = z.object({
    id: z.number().optional(),
	diagnosisText: z.string().min(1, 'Diagnosis is required'),
	code: z.string().min(1, 'Code is required'),
});

export type DiagnosisFormType = z.infer<typeof diagnosisSchema>;