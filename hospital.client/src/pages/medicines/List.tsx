import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Plus, FileText, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Schema
export interface RxInfo {
	id: number;
	name: string;
	type: string;
	remarks: string;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
}

const List = () => {
	const [rxList, setRxList] = useState<RxInfo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const handleDelete = async (id: number) => {
		const confirmed = window.confirm('Are you sure you want to delete this prescription?');
		if (!confirmed) return;
	
		try {
			await axios.delete(`/api/RxInfo/${id}`);
			setRxList((prev) => prev.filter((rx) => rx.id !== id));
			toast.success('Prescription deleted successfully');
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || 'Failed to delete prescription. Please try again.'
			);
		}
	};
	
	useEffect(() => {
		const fetchRxList = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/api/RxInfo');
				setRxList(response.data);
				toast.success('Rx data loaded successfully');
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Failed to load Rx info. Please try again later.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRxList();
	}, []);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold">Rx List</h1>
					<p className="text-muted-foreground">Manage prescription information</p>
				</div>
				<Button onClick={() => navigate('/medicine/new')}>
					<Plus className="mr-2 h-4 w-4" />
					Add New Rx
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<p>Loading Rx info...</p>
				</div>
			) : rxList.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<FileText className="h-12 w-12 text-muted-foreground mb-4" />
					<h2 className="text-xl mb-2">No Rx Info Found</h2>
					<p className="text-muted-foreground mb-4">
						No prescription records found. Would you like to add one?
					</p>
					<Button onClick={() => navigate('/medicine/new')}>
						<Plus className="mr-2 h-4 w-4" />
						Add Rx
					</Button>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Remarks</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Created By</TableHead>
							<TableHead>Updated At</TableHead>
							<TableHead>Updated By</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rxList.map((rx) => (
							<TableRow key={rx.id}>
								<TableCell>{rx.name}</TableCell>
								<TableCell>{rx.type}</TableCell>
								<TableCell>{rx.remarks}</TableCell>
								<TableCell>{new Date(rx.createdAt).toLocaleString()}</TableCell>
								<TableCell>{rx.createdBy}</TableCell>
								<TableCell>{new Date(rx.updatedAt).toLocaleString()}</TableCell>
								<TableCell>{rx.updatedBy}</TableCell>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigate(`/medicine/edit/${rx.id}`)}
									>
										<Edit className="h-4 w-4 text-muted-foreground" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(rx.id)}
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
