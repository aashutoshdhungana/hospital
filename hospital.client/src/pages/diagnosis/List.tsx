// DiagnosisList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface DiagnosisInfo {
	id: number;
	diagnosisText: string;
	code: string;
	createdBy: string;
	updatedBy: string;
}

const List = () => {
	const [diagnosisList, setDiagnosisList] = useState<DiagnosisInfo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const handleDelete = async (id: number) => {
		const confirmed = window.confirm('Are you sure you want to delete this diagnosis?');
		if (!confirmed) return;

		try {
			await axios.delete(`/api/DiagnosisInfo/${id}`);
			setDiagnosisList((prev) => prev.filter((item) => item.id !== id));
			toast.success('Diagnosis deleted successfully');
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || 'Failed to delete diagnosis. Please try again.'
			);
		}
	};

	useEffect(() => {
		const fetchDiagnosisList = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/api/DiagnosisInfo');
				setDiagnosisList(response.data);
				toast.success('Diagnosis data loaded successfully');
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Failed to load Diagnosis info.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDiagnosisList();
	}, []);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold">Diagnosis List</h1>
					<p className="text-muted-foreground">Manage diagnosis entries</p>
				</div>
				<Button onClick={() => navigate('/diagnosis/new')}>
					<Plus className="mr-2 h-4 w-4" />
					Add Diagnosis
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<p>Loading...</p>
				</div>
			) : diagnosisList.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<FileText className="h-12 w-12 text-muted-foreground mb-4" />
					<h2 className="text-xl mb-2">No Diagnoses Found</h2>
					<p className="text-muted-foreground mb-4">
						You can add a new diagnosis now.
					</p>
					<Button onClick={() => navigate('/diagnosis/new')}>
						<Plus className="mr-2 h-4 w-4" />
						Add Diagnosis
					</Button>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Diagnosis</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Created By</TableHead>
							<TableHead>Updated By</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{diagnosisList.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.diagnosisText}</TableCell>
								<TableCell>{item.code}</TableCell>
								<TableCell>{item.createdBy}</TableCell>
								<TableCell>{item.updatedBy}</TableCell>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigate(`/diagnosis/edit/${item.id}`)}
									>
										<Edit className="h-4 w-4 text-muted-foreground" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(item.id)}
									>
										<Trash className="h-4 w-4 text-muted-foreground" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default List;
