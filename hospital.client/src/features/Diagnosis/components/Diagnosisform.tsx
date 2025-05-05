import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { diagnosisSchema, DiagnosisFormType} from '../types/DiagnosisSchema';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

type Props = {
	onSubmit: (data: DiagnosisFormType) => Promise<void>;
	isSubmitting: boolean;
	defaultValues?: Partial<DiagnosisFormType>;
    selectedRx: RxType[];
    refreshData: () => void;
};

export interface RxType {
    id: number;
    name: string;
    type: string;
    remarks?: string;
}

export const DiagnosisForm = ({ onSubmit, isSubmitting, defaultValues, selectedRx, refreshData }: Props) => {
	const form = useForm<DiagnosisFormType>({
		resolver: zodResolver(diagnosisSchema),
		defaultValues: {
			diagnosisText: '',
			code: '',
			...defaultValues,
		},
	});

    const [rxOptions, setRxOptions] = useState<RxType[]>([]);
    const [selectedRxId, setSelectedRxId] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const getRxDropdown = async () => {
            try {
              const response = await axios.get('/api/RxInfo');
              const data = response.data as RxType[];
              setRxOptions(data);
            } catch (error) {
              toast.error('Failed to load Rx options');
              setRxOptions([]);
            }
        };
        
        getRxDropdown();
    }, []);

    const isEditMode = !!defaultValues?.id;

    const handleAddPrescription = async () => {
        if (!defaultValues?.id || !selectedRxId) return;

        try {
            const rxId = parseInt(selectedRxId);
            const response = await axios.post(`/api/diagnosisInfo/${defaultValues.id}/prescription/${rxId}`);
            if (response.status === 200) {
                toast.success('Prescription added successfully');
                refreshData();
                setIsDialogOpen(false);
                setSelectedRxId("");
            }
        } catch (error) {
            toast.error('Failed to add prescription');
        }
    }

    const handleRemovePrescription = async (rxId: number) => {
        if (!defaultValues?.id) return;

        try {
            const response = await axios.delete(`/api/diagnosisInfo/${defaultValues.id}/prescription/${rxId}`);
            if (response.status === 200) {
                toast.success('Prescription removed successfully');
                refreshData();
            }
        } catch (error) {
            toast.error('Failed to remove prescription');
        }
    }

    // Filter out Rx options that are already selected
    const availableRxOptions = rxOptions.filter(
        option => !selectedRx.some(rx => rx.id === option.id)
    );

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="diagnosisText"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Diagnosis</FormLabel>
							<FormControl>
								<Input placeholder="Enter diagnosis" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<Input placeholder="Enter code" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
                
                {isEditMode && (
					<div className="mt-8 space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Prescriptions</h3>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-2" /> Add Prescription
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Prescription</DialogTitle>
                                        <DialogDescription>
                                            Select a prescription to add to this diagnosis.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Select value={selectedRxId} onValueChange={setSelectedRxId}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select prescription" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRxOptions.length > 0 ? (
                                                    availableRxOptions.map((rx) => (
                                                        <SelectItem key={rx.id} value={rx.id.toString()}>
                                                            {rx.name} ({rx.type})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        No prescriptions available
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter>
                                        <Button 
                                            onClick={handleAddPrescription} 
                                            disabled={!selectedRxId}
                                        >
                                            Add
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Remarks</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{selectedRx.length > 0 ? (
									selectedRx.map((rx) => (
										<TableRow key={rx.id}>
											<TableCell>{rx.name}</TableCell>
											<TableCell>{rx.type}</TableCell>
											<TableCell>{rx.remarks}</TableCell>
											<TableCell>
												<Button
													size="icon"
													variant="ghost"
                                                    type='button'
													onClick={() => handleRemovePrescription(rx.id)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} className="text-center py-4 text-gray-500">
											No prescriptions added
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}
				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Saving...' : 'Save Diagnosis'}
				</Button>
			</form>
		</Form>
	);
};