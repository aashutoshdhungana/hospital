import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { DiagnosisFormType } from '@/features/Diagnosis/types/DiagnosisSchema';
import { DiagnosisForm } from '@/features/Diagnosis/components/Diagnosisform';

const Create = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (data: DiagnosisFormType) => {
		try {
			setIsSubmitting(true);
			await axios.post('/api/DiagnosisInfo', data);
			toast.success('Diagnosis created successfully!');
			navigate('/diagnosis');
		} catch (error) {
			toast.error('Failed to create diagnosis');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Create Diagnosis</h1>
			<DiagnosisForm onSubmit={handleSubmit} isSubmitting={isSubmitting} selectedRx={[]} refreshData={() => {}} />
		</div>
	);
};

export default Create;
