// src/components/AppointmentForm.tsx
import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef } from 'ag-grid-community';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface SkinAnalysisType {
    id: number;
    name: string;
}

interface RxType {
    id: number;
    name: string
}

interface SkinAnalysis {
    id: number;
    skinAnalysisTypeId: number;
    analysis: string;
    isAbnormal: boolean;
}

interface Medication {
    id: number;
    rxId: number;
    applicationType: string;
    timesPerDay: number;
    durationInDays: number;
    startDate: string;
    remarks?: string;
}

export default function AppointmentForm() {
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [historyOfIllness, setHistoryOfIllness] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');

    const [skinAnalysisRowData, setSkinAnalysisRowData] = useState<SkinAnalysis[]>([]);
    const [medicationsRowData, setMedicationsRowData] = useState<Medication[]>([]);

    const [skinAnalysisTypes, setSkinAnalysisTypes] = useState<SkinAnalysisType[]>([]);
    const [rxOptions, setRxOptions] = useState<RxType[]>([]);

    const [skinDialogOpen, setSkinDialogOpen] = useState(false);
    const [medDialogOpen, setMedDialogOpen] = useState(false);

    const [editingSkin, setEditingSkin] = useState<Partial<SkinAnalysis>>({});
    const [editingMed, setEditingMed] = useState<Partial<Medication>>({});

    const { id } = useParams();

    const getSkinAnalysisRowData = async () => {
        try {
            let response = await axios.get(`/api/appointment/${id}/skin-analysis`)
            let data = response.data as SkinAnalysis[]
            setSkinAnalysisRowData(data)
        } catch {
            toast.error('Failed to load skin analysis data')
            setSkinAnalysisRowData([])
        }
    }

    const getMedications = async () => {
        try {
            let response = await axios.get(`/api/appointment/${id}/medications`)
            let data = response.data as Medication[]
            setMedicationsRowData(data)
        } catch {
            toast.error('Failed to load medication data')
            setMedicationsRowData([])
        }
    }

    const getAssesmentData = async () => {
        try {
            let response = await axios.get(`/api/appointment/${id}`)
            const { chiefComplaint, historyOfIllness, diagnosis, advice } = response.data.medicalAssesment  ?? {}
            setChiefComplaint(chiefComplaint)
            setHistoryOfIllness(historyOfIllness)
            setDiagnosis(diagnosis)
            setAdvice(advice);
        } catch {
            toast.error('Failed to load medication data')
        }
    }

    useEffect(() => {
        const getSkinAnalysisTypes = async () => {
            try {
                let response = await axios.get('/api/skin-analysis-types');
                let data = response.data as SkinAnalysisType[]
                setSkinAnalysisTypes(data);
            } catch {
                toast.error('Failed to load skin analysis types')
                setSkinAnalysisTypes([])
            }
        }

        const getRxDropdown = async () => {
            try {
                let response = await axios.get('/api/RxInfo');
                let data = response.data as RxType[]
                setRxOptions(data)
            } catch {
                toast.error('Failed to load Rx options')
                setRxOptions([])
            }
        }
        getSkinAnalysisTypes()
        getRxDropdown()
        getSkinAnalysisRowData()
        getMedications()
        getAssesmentData()
    }, [id]);

    const saveSkinAnalysis = async () => {
        try {
            if (editingSkin.id) {
                await axios.put(`/api/appointment/${id}/skin-analysis/${editingSkin.id}`, editingSkin);
                setTimeout(() => getSkinAnalysisRowData(), 0)
                toast.success('Skin analysis updated successfully');
            } else {
                await axios.post(`/api/appointment/${id}/skin-analysis`, editingSkin);
                setTimeout(() => getSkinAnalysisRowData(), 0)
                toast.success('Skin analysis added successfully');
            }
            setSkinDialogOpen(false);
        } catch (error) {
            toast.error('Failed to save skin analysis');
        }
    };

    const saveMedication = async () => {
        try {
            if (editingMed.id) {
                await axios.put(`/api/appointment/${id}/medications/${editingMed.id}`, {...editingMed, startDate:  new Date(editingMed.startDate ?? "").toISOString()});
                setTimeout(() => getMedications(), 0)
                toast.success('Medication updated successfully');
            } else {
                await axios.post(`/api/appointment/${id}/medications`, {...editingMed, startDate:  new Date(editingMed.startDate ?? "").toISOString()});
                setTimeout(() => getMedications(), 0)
                toast.success('Medication added successfully');
            }
            setMedDialogOpen(false);
        } catch (error) {
            toast.error('Failed to save medication');
        }
    };

    // Custom cell renderers
    const ActionsRenderer = (props: any) => {
        return (
            <div className="flex gap-2 items-center">
                <Button
                    onClick={() => {
                        if (props.column.colId === 'skinActions') {
                            setEditingSkin(props.data);
                            setSkinDialogOpen(true);
                        } else {
                            setEditingMed(props.data);
                            setMedDialogOpen(true);
                        }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                >
                    <Edit size={16} />
                </Button>
                <Button
                    onClick={() => {
                        if (props.column.colId === 'skinActions') {
                            deleteSkinRow(props.data.id);
                        } else {
                            deleteMedicationRow(props.data.id);
                        }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                    <Trash size={16} />
                </Button>
            </div>
        );
    };

    const skinColumnDefs: ColDef[] = [
        {
            headerName: 'Skin Analysis Type',
            field: 'skinAnalysisTypeId',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: skinAnalysisTypes.map(type => type.id.toString()),
            },
            valueFormatter: (params: any) => {
                const match = skinAnalysisTypes.find(type => type.id === +params.value);
                return match ? match.name : params.value;
            },
        },
        {
            field: 'analysis',
        },
        {
            field: 'isAbnormal',
        }, {
            headerName: 'Actions',
            colId: 'skinActions',
            cellRenderer: ActionsRenderer,
            width: 120,
            sortable: false,
            filter: false
        },
    ];

    const medicationColumnDefs: ColDef[] = [
        {
            headerName: 'Rx Name',
            field: 'rxId',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: rxOptions.map(type => type.id.toString()),
            },
            valueFormatter: (params: any) => {
                const match = rxOptions.find(type => type.id === +params.value);
                return match ? match.name : params.value;
            },
        },
        {
            field: 'applicationType',
        },
        {
            field: 'timesPerDay',
        },
        {
            field: 'durationInDays',
        },
        {
            field: 'startDate',
            valueFormatter: (params: any) => {
                return new Date(params.value).toLocaleDateString()
            }
        },
        {
            field: 'remarks',
        },
        {
            headerName: 'Actions',
            colId: 'medActions',
            cellRenderer: ActionsRenderer,
            width: 120,
            sortable: false,
            filter: false
        },
    ];

    const deleteSkinRow = async (skinId: number) => {
        try {
            await axios.delete(`/api/appointment/${id}/skin-analysis/${skinId}`);
            setTimeout(() => getSkinAnalysisRowData(), 0)
            toast.success('Skin analysis deleted successfully');
        } catch (error) {
            toast.error('Failed to delete skin analysis');
        }
    };

    const deleteMedicationRow = async (medicationId: number) => {
        try {
            await axios.delete(`/api/appointment/${id}/medications/${medicationId}`);
            setTimeout(() => getMedications(), 0)
            toast.success('Medication deleted successfully');
        } catch (error) {
            toast.error('Failed to delete medication');
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`/api/appointment/${id}/assessment`, {
                chiefComplaint: chiefComplaint,
                historyOfIllness: historyOfIllness,
                diagnosis: diagnosis,
                advice: advice,
            });
            getAssesmentData()
            toast.success('Assessment saved successfully!');
        } catch (error) {
            toast.error('Failed to save assessment');
        }
    };

    const defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        flex: 1
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Patient Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="chief-complaint">Chief Complaints</Label>
                    <Textarea
                        id="chief-complaint"
                        placeholder="Enter patient's chief complaints"
                        value={chiefComplaint}
                        onChange={e => setChiefComplaint(e.target.value)}
                        className="min-h-20"
                    />
                </div>

                <div className="space-y-4">
                    <Label htmlFor="history">History of Illness</Label>
                    <Textarea
                        id="history"
                        placeholder="Enter patient's history of illness"
                        value={historyOfIllness}
                        onChange={e => setHistoryOfIllness(e.target.value)}
                        className="min-h-20"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Skin Analysis</Label>
                        <Button
                            onClick={() => { setEditingSkin({}); setSkinDialogOpen(true); }}
                            variant="outline"
                            className="gap-2"
                        >
                            <span>Add Analysis</span>
                        </Button>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <AgGridReact
                            rowData={skinAnalysisRowData}
                            columnDefs={skinColumnDefs}
                            rowSelection="single"
                            animateRows={true}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                        id="diagnosis"
                        placeholder="Enter diagnosis"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        className="min-h-20"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Medication</Label>
                        <Button
                            onClick={() => { setEditingMed({}); setMedDialogOpen(true); }}
                            variant="outline"
                            className="gap-2"
                        >
                            <span>Add Medication</span>
                        </Button>
                    </div>
                    <div className="ag-theme-alpine" style={{ height: '250px', width: '100%' }}>
                        <AgGridReact
                            rowData={medicationsRowData}
                            columnDefs={medicationColumnDefs}
                            rowSelection="single"
                            animateRows={true}
                            defaultColDef={defaultColDef}
                            rowHeight={48}
                            headerHeight={48}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label htmlFor="advice">Advice</Label>
                    <Textarea
                        id="advice"
                        placeholder="Enter advice for patient"
                        value={advice}
                        onChange={e => setAdvice(e.target.value)}
                        className="min-h-20"
                    />
                </div>

                <div className="pt-4">
                    <Button onClick={handleSubmit} className="w-full sm:w-auto">Submit Assessment</Button>
                </div>
            </CardContent>

            <Dialog open={skinDialogOpen} onOpenChange={setSkinDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSkin?.id ? 'Edit Skin Analysis' : 'Add Skin Analysis'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="skin-type">Type</Label>
                            <Select
                                value={editingSkin.skinAnalysisTypeId?.toString() || ""}
                                onValueChange={(value) => setEditingSkin({
                                    ...editingSkin,
                                    skinAnalysisTypeId: value ? parseInt(value) : 0
                                })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skinAnalysisTypes.map(t => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="analysis">Analysis</Label>
                            <Textarea
                                id="analysis"
                                placeholder="Enter analysis"
                                value={editingSkin.analysis ?? ''}
                                onChange={e => setEditingSkin({ ...editingSkin, analysis: e.target.value })}
                                className="min-h-20"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is-abnormal"
                                checked={editingSkin.isAbnormal ?? false}
                                onCheckedChange={() => setEditingSkin({...editingSkin, isAbnormal: !editingSkin.isAbnormal  })}
                            />
                            <Label htmlFor="is-abnormal" className="cursor-pointer">Is Abnormal</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSkinDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveSkinAnalysis}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={medDialogOpen} onOpenChange={setMedDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingMed?.id ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rx-type">Rx</Label>
                            <Select
                                value={editingMed.rxId?.toString() ?? ''}
                                onValueChange={(value) => setEditingMed({
                                    ...editingMed,
                                    rxId: value ? parseInt(value) : 0
                                })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rxOptions.map(t => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <select
                                id="rx-type"
                                value={editingMed.rxId ?? ''}
                                onChange={e => setEditingMed({ ...editingMed, rxId: parseInt(e.target.value) })}
                                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Rx</option>
                                {rxOptions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select> */}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="application-type">Application Type</Label>
                            <Input
                                id="application-type"
                                placeholder="e.g., Topical, Oral"
                                value={editingMed.applicationType ?? ''}
                                onChange={e => setEditingMed({ ...editingMed, applicationType: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="times-per-day">Times Per Day</Label>
                                <Input
                                    id="times-per-day"
                                    type="number"
                                    placeholder="Times Per Day"
                                    value={editingMed.timesPerDay ?? ''}
                                    onChange={e => setEditingMed({ ...editingMed, timesPerDay: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (Days)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="Duration In Days"
                                    value={editingMed.durationInDays ?? ''}
                                    onChange={e => setEditingMed({ ...editingMed, durationInDays: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={editingMed.startDate ?? ''}
                                onChange={e => setEditingMed({ ...editingMed, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea
                                id="remarks"
                                placeholder="Additional notes or instructions"
                                value={editingMed.remarks ?? ''}
                                onChange={e => setEditingMed({ ...editingMed, remarks: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMedDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveMedication}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}