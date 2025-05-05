import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { DiagnosisFormType } from '@/features/Diagnosis/types/DiagnosisSchema';
import { DiagnosisForm, RxType } from '@/features/Diagnosis/components/Diagnosisform';
const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [defaultValues, setDefaultValues] = useState<DiagnosisFormType | null>(null);
    const [selectedRx, setSelectedRx] = useState<RxType[]>([]);
    const fetchDiagnosis = async () => {
        try {
            const response = await axios.get(`/api/DiagnosisInfo/${id}`);
            setDefaultValues({
                id: response.data.id,
                diagnosisText: response.data.diagnosisText,
                code: response.data.code,
            });

            setSelectedRx(response.data.prescriptions)
        } catch {
            toast.error('Failed to fetch diagnosis');
        }
    };

	useEffect(() => {
		fetchDiagnosis();
	}, [id]);

	const handleSubmit = async (data: DiagnosisFormType) => {
		try {
			setIsSubmitting(true);
			await axios.put(`/api/DiagnosisInfo/${id}`, data);
			toast.success('Diagnosis updated');
			navigate('/diagnosis');
		} catch {
			toast.error('Failed to update diagnosis');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!defaultValues) return <p className="p-6">Loading...</p>;

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Edit Diagnosis</h1>
			<DiagnosisForm
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				defaultValues={defaultValues}
                selectedRx={selectedRx}
                refreshData={() => fetchDiagnosis()}
			/>
		</div>
	);
};

export default Edit;
