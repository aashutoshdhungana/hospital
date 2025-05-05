'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { RxInfoForm } from '@/features/Medicines/components/RxInfoForm';
import { RxInfoForm as RxInfoFormType } from '@/features/Medicines/types/RxSchema';

const Create = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (data: RxInfoFormType) => {
		try {
			setIsSubmitting(true);
			await axios.post('/api/RxInfo', data);
			toast.success('Rx created successfully!');
			navigate('/medicines');
		} catch (error) {
			console.error(error);
			toast.error('Failed to create Rx. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold">Create New Rx</h1>
			</div>
			<RxInfoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
		</div>
	);
};

export default Create;
