import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
	phoneSchema,
	createUserSchema,
	Gender,
	createPatientSchema
} from "../schema/PatientSchema"; // Reuse the user-related schemas

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreatePatientForm() {
	const [step, setStep] = useState<"phone" | "user" | "patient">("phone");
	const [userId, setUserId] = useState<number | null>(null);

	const navigate = useNavigate();

	const phoneForm = useForm({
		resolver: zodResolver(phoneSchema),
		defaultValues: { phoneNumber: "" },
	});

	const userForm = useForm({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			firstName: "",
			middleName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			gender: 0,
			street: "",
			city: "",
			state: "",
			country: "",
			dateOfBirth: "",
		},
	});

	const patientForm = useForm({
		resolver: zodResolver(createPatientSchema),
		defaultValues: {
			emergencyContactPerson: "",
			emergencyContactNumber: "",
		},
	});

	const checkPhoneNumber = async (data: any) => {
		try {
			const res = await axios.get(`/api/userInfo/username/${data.phoneNumber}`);
			if (res.data?.id) {
				setUserId(res.data.id);
				setStep("patient");
				toast.info("User already exists. Proceed to create patient.");
			} else {
				userForm.setValue("phoneNumber", data.phoneNumber);
				setStep("user");
			}
		} catch {
			userForm.setValue("phoneNumber", data.phoneNumber);
			setStep("user");
		}
	};

	const createUser = async (data: any) => {
		try {
			const res = await axios.post("/api/userInfo", data);
			setUserId(res.data.id);
			toast.success("User created successfully!");
			setStep("patient");
		} catch {
			toast.error("Failed to create user. Please try again.");
		}
	};

	const createPatient = async (data: any) => {
		if (!userId) return;
		try {
			await axios.post(`/api/patient`, { ...data, userInfoId: userId });
			toast.success("Patient created successfully!");
			navigate('/patients');
		} catch {
			toast.error("Failed to create patient. Please try again.");
		}
	};

	return (
		<div className="max-w-xl mx-auto mt-10 space-y-6">
			{step === "phone" && (
				<Form {...phoneForm}>
					<form onSubmit={phoneForm.handleSubmit(checkPhoneNumber)} className="space-y-4">
						<FormField
							control={phoneForm.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="Enter phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Next</Button>
					</form>
				</Form>
			)}

			{step === "user" && (
				<Form {...userForm}>
					<form onSubmit={userForm.handleSubmit(createUser)} className="space-y-6">
						{/* Name Fields */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField name="firstName" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input placeholder="First name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField name="middleName" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Middle Name (Optional)</FormLabel>
									<FormControl>
										<Input placeholder="Middle name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField name="lastName" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Last name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
						</div>

						{/* Contact Fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField name="email" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
							<FormField name="phoneNumber" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="Phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
						</div>

						{/* Gender and Date of Birth */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField name="gender" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={Gender.Male.toString()}>Male</SelectItem>
											<SelectItem value={Gender.Female.toString()}>Female</SelectItem>
											<SelectItem value={Gender.Other.toString()}>Other</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)} />

							<FormField name="dateOfBirth" control={userForm.control} render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />
						</div>

						{/* Address Fields */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Address Information</h2>

							<FormField name="street" control={userForm.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Street Address</FormLabel>
									<FormControl>
										<Input placeholder="Street address" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)} />

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormField name="city" control={userForm.control} render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input placeholder="City" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
								<FormField name="state" control={userForm.control} render={({ field }) => (
									<FormItem>
										<FormLabel>State/Province</FormLabel>
										<FormControl>
											<Input placeholder="State" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
								<FormField name="country" control={userForm.control} render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input placeholder="Country" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							</div>
						</div>

						<Button type="submit" className="w-full">
							Create User
						</Button>
					</form>
				</Form>
			)}


			{step === "patient" && (
				<Form {...patientForm}>
					<form onSubmit={patientForm.handleSubmit(createPatient)} className="space-y-4">
						<FormField name="emergencyContactPerson" control={patientForm.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Emergency Contact Person</FormLabel>
								<FormControl><Input {...field} /></FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField name="emergencyContactNumber" control={patientForm.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Emergency Contact Number</FormLabel>
								<FormControl><Input {...field} /></FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<Button type="submit">Create Patient</Button>
					</form>
				</Form>
			)}
		</div>
	);
}
