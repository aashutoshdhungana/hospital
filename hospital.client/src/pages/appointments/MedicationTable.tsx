// src/components/MedicationsTable.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Trash } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface RxType {
  id: number;
  name: string;
}

export interface Medication {
  id: number;
  rxId: number;
  applicationType: string;
  timesPerDay: number;
  durationInDays: number;
  startDate: string;
  remarks?: string;
}

interface MedicationsTableProps {
  appointmentId: string;
  medicationsData: Medication[];
  refreshData: () => void;
}

export default function MedicationsTable({ 
  appointmentId,  
  medicationsData,
  refreshData 
}: MedicationsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Partial<Medication>>({});
  const [rxOptions, setRxOptions] = useState<RxType[]>([]);

  const handleAddClick = () => {
    setEditingMed({});
    setDialogOpen(true);
  };

  useEffect(() => {
    const getRxDropdown = async () => {
        try {
          let response = await axios.get('/api/RxInfo');
          let data = response.data as RxType[];
          setRxOptions(data);
        } catch (error) {
          toast.error('Failed to load Rx options');
          setRxOptions([]);
        }
      };

    getRxDropdown();
  }, [])
  const handleEditClick = (medication: Medication) => {
    // Format date to YYYY-MM-DD for input[type="date"]
    const formattedDate = medication.startDate 
      ? new Date(medication.startDate).toISOString().split('T')[0]
      : '';
      
    setEditingMed({
      ...medication,
      startDate: formattedDate
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = async (medicationId: number) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete the medication?');
        if (!confirmDelete) return;
      await axios.delete(`/api/appointment/${appointmentId}/medications/${medicationId}`);
      refreshData();
      toast.success('Medication deleted successfully');
    } catch (error) {
      toast.error('Failed to delete medication');
    }
  };

  const saveMedication = async () => {
    try {
      const medicationData = {
        ...editingMed,
        startDate: new Date(editingMed.startDate ?? "").toISOString()
      };
      
      if (editingMed.id) {
        await axios.put(`/api/appointment/${appointmentId}/medications/${editingMed.id}`, medicationData);
        toast.success('Medication updated successfully');
      } else {
        await axios.post(`/api/appointment/${appointmentId}/medications`, medicationData);
        toast.success('Medication added successfully');
      }
      setDialogOpen(false);
      refreshData();
    } catch (error) {
      toast.error('Failed to save medication');
    }
  };

  const getRxName = (id: number) => {
    const match = rxOptions.find(rx => rx.id === id);
    return match ? match.name : id.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Medication</Label>
        <Button
          onClick={handleAddClick}
          variant="outline"
          className="gap-2"
        >
          <span>Add Medication</span>
        </Button>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rx Name</TableHead>
              <TableHead>Application Type</TableHead>
              <TableHead>Times Per Day</TableHead>
              <TableHead>Duration (Days)</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicationsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                  No medication data available
                </TableCell>
              </TableRow>
            ) : (
              medicationsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getRxName(item.rxId)}</TableCell>
                  <TableCell>{item.applicationType}</TableCell>
                  <TableCell>{item.timesPerDay}</TableCell>
                  <TableCell>{item.durationInDays}</TableCell>
                  <TableCell>{formatDate(item.startDate)}</TableCell>
                  <TableCell>{item.remarks || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => handleEditClick(item)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(item.id)}
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
                  {rxOptions.map(rx => (
                    <SelectItem key={rx.id} value={rx.id.toString()}>
                      {rx.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  onChange={e => setEditingMed({ 
                    ...editingMed, 
                    timesPerDay: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Duration In Days"
                  value={editingMed.durationInDays ?? ''}
                  onChange={e => setEditingMed({ 
                    ...editingMed, 
                    durationInDays: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveMedication}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}