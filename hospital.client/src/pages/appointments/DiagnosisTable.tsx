// src/components/DiagnosesTable.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface DiagnosisInfo {
	id: number;
	diagnosisText: string;
}

export interface DiagnosisRecord {
	id: number;
	diagnosisInfoId: number;
	diagnosisText: string;
	code: string;
	remarks?: string;
}

interface DiagnosesTableProps {
	appointmentId: string;
	diagnosesData: DiagnosisRecord[];
	refreshData: () => void;
}

export default function DiagnosesTable({
	appointmentId,
	diagnosesData,
	refreshData,
}: DiagnosesTableProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingDiagnosis, setEditingDiagnosis] = useState<Partial<DiagnosisRecord>>({});
	const [diagnosisOptions, setDiagnosisOptions] = useState<DiagnosisInfo[]>([]);

	useEffect(() => {
		const fetchDiagnosisOptions = async () => {
			try {
				const res = await axios.get('/api/DiagnosisInfo');
				setDiagnosisOptions(res.data);
			} catch (err) {
				toast.error('Failed to load diagnosis options');
			}
		};

		fetchDiagnosisOptions();
	}, []);

	const handleAddClick = () => {
		setEditingDiagnosis({});
		setDialogOpen(true);
	};

	const handleEditClick = (record: DiagnosisRecord) => {
		setEditingDiagnosis({ ...record });
		setDialogOpen(true);
	};

	const handleDeleteClick = async (id: number) => {
		try {
            const confirmDelete = window.confirm('Are you sure you want to delete this diagnosis?');
            if (!confirmDelete) return;
			await axios.delete(`/api/appointment/${appointmentId}/diagnoses/${id}`);
			toast.success('Diagnosis deleted successfully');
			refreshData();
		} catch (err) {
			toast.error('Failed to delete diagnosis');
		}
	};

	const saveDiagnosis = async () => {
		try {
			const dto = {
				diagnosisInfoId: editingDiagnosis.diagnosisInfoId!,
				remarks: editingDiagnosis.remarks || '',
			};

			if (editingDiagnosis.id) {
				await axios.put(
					`/api/appointment/${appointmentId}/diagnoses/${editingDiagnosis.id}`,
					dto
				);
				toast.success('Diagnosis updated successfully');
			} else {
				await axios.post(`/api/appointment/${appointmentId}/diagnoses`, dto);
				toast.success('Diagnosis added successfully');
			}

			setDialogOpen(false);
			refreshData();
		} catch (err) {
			toast.error('Failed to save diagnosis');
		}
	};

	const getDiagnosisText = (id: number) => {
		const match = diagnosisOptions.find(d => d.id === id);
		return match ? match.diagnosisText : id.toString();
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label className="text-lg font-semibold">Diagnoses</Label>
				<Button variant="outline" className="gap-2" onClick={handleAddClick}>
					<span>Add Diagnosis</span>
				</Button>
			</div>

			<div className="border rounded-md overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Diagnosis</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Remarks</TableHead>
							<TableHead className="w-24">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{diagnosesData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="text-center text-muted-foreground py-6">
									No diagnosis data available
								</TableCell>
							</TableRow>
						) : (
							diagnosesData.map(d => (
								<TableRow key={d.id}>
									<TableCell>{getDiagnosisText(d.diagnosisInfoId)}</TableCell>
									<TableCell>{d.code}</TableCell>
									<TableCell>{d.remarks || '-'}</TableCell>
									<TableCell>
										<div className="flex gap-2 items-center">
											<Button
												onClick={() => handleEditClick(d)}
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0"
											>
												<Edit size={16} />
											</Button>
											<Button
												onClick={() => handleDeleteClick(d.id)}
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
											>
												<Trash size={16} />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editingDiagnosis.id ? 'Edit Diagnosis' : 'Add Diagnosis'}</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Diagnosis</Label>
							<Select
								value={editingDiagnosis.diagnosisInfoId?.toString() ?? ''}
								onValueChange={val =>
									setEditingDiagnosis({
										...editingDiagnosis,
										diagnosisInfoId: parseInt(val),
									})
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder="Select Diagnosis"  />
								</SelectTrigger>
								<SelectContent>
									{diagnosisOptions.map(diag => (
										<SelectItem key={diag.id} value={diag.id.toString()}>
											{diag.diagnosisText}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Remarks</Label>
							<Textarea
								placeholder="Optional remarks"
								value={editingDiagnosis.remarks ?? ''}
								onChange={e =>
									setEditingDiagnosis({ ...editingDiagnosis, remarks: e.target.value })
								}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={saveDiagnosis}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
