'use client';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RxInfoSchema, RxInfoForm as RxInfoFormType } from '../types/RxSchema';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from 'react';

type RxFormProps = {
	onSubmit: (data: RxInfoFormType) => Promise<void>;
	isSubmitting: boolean;
	defaultValues?: Partial<RxInfoFormType>;
};

interface Diagnosis {
	id: number;
	diagnosisText: string;
}

export const RxInfoForm = ({
	onSubmit,
	isSubmitting,
	defaultValues,
}: RxFormProps) => {
	const form = useForm<RxInfoFormType>({
		resolver: zodResolver(RxInfoSchema),
		defaultValues: {
			name: '',
			type: '',
			remarks: '',
			diagnosisId: '',
			...defaultValues,
		},
	});
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
	useEffect(() => {
		const fetchDiagnoses = async () => {
			try {
				const response = await axios.get<Diagnosis[]>('/api/DiagnosisInfo');
				setDiagnoses(response.data.map(x => {
					return { id: x.id, diagnosisText: x.diagnosisText }
				}));
			} catch (error) {
				console.error("Failed to fetch diagnosis", error);
			}
		};
		fetchDiagnoses();
	}, [])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Paracetamol" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Type */}
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Tablet" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="diagnosisId"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Diagnosis</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder="Select diagnosis">
												{diagnoses.find(d => d.id.toString() === field.value.toString())?.diagnosisText}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{diagnoses.map((diagnosis) => (
												<SelectItem key={diagnosis.id} value={diagnosis.id.toString()}>
													{diagnosis.diagnosisText}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)
					}}
				/>


				{/* Remarks */}
				<FormField
					control={form.control}
					name="remarks"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Remarks</FormLabel>
							<FormControl>
								<Textarea placeholder="Optional remarks..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Submitting...' : 'Save Rx'}
				</Button>
			</form>
		</Form>
	);
};
