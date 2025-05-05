'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { RxInfoForm } from '@/features/Medicines/components/RxInfoForm';
import { RxInfoForm as RxInfoFormType } from '@/features/Medicines/types/RxSchema';

const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [defaultValues, setDefaultValues] = useState<RxInfoFormType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRxInfo = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`/api/RxInfo/${id}`);
				const data = response.data;
				setDefaultValues({
					name: data.name || '',
					type: data.type || '',
                    diagnosisId: data.diagnosisId || '',
					remarks: data.remarks || '',
				});
			} catch (error) {
				toast.error('Failed to load Rx info.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchRxInfo();
	}, [id]);

	const handleSubmit = async (data: RxInfoFormType) => {
		try {
			setIsSubmitting(true);
			await axios.put(`/api/RxInfo/${id}`, data);
			toast.success('Rx updated successfully!');
			navigate('/medicines');
		} catch (error) {
			console.error(error);
			toast.error('Failed to update Rx. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading || !defaultValues) {
		return <div className="p-6 text-center">Loading...</div>;
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold">Edit Rx</h1>
			</div>
			<RxInfoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} defaultValues={defaultValues} />
		</div>
	);
};

export default Edit;
