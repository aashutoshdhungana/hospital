// src/components/SkinAnalysisTable.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Trash } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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

interface SkinAnalysisType {
  id: number;
  name: string;
}

export interface SkinAnalysis {
  id: number;
  skinAnalysisTypeId: number;
  analysis: string;
  isAbnormal: boolean;
}

interface SkinAnalysisTableProps {
  appointmentId: string;
  skinAnalysisData: SkinAnalysis[];
  refreshData: () => void;
}

export default function SkinAnalysisTable({ 
  appointmentId, 
  skinAnalysisData,
  refreshData 
}: SkinAnalysisTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkin, setEditingSkin] = useState<Partial<SkinAnalysis>>({});
  const [skinAnalysisTypes, setSkinAnalysisTypes] = useState<SkinAnalysisType[]>([]);

  useEffect(() => {
    const getSkinAnalysisTypes = async () => {
        try {
          let response = await axios.get('/api/skin-analysis-types');
          let data = response.data as SkinAnalysisType[];
          setSkinAnalysisTypes(data);
        } catch (error) {
          toast.error('Failed to load skin analysis types');
          setSkinAnalysisTypes([]);
        }
      };
    getSkinAnalysisTypes();  
  }, [])
  const handleAddClick = () => {
    setEditingSkin({});
    setDialogOpen(true);
  };

  const handleEditClick = (skinAnalysis: SkinAnalysis) => {
    setEditingSkin(skinAnalysis);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (skinId: number) => {
    try {
    const confirmDelete = window.confirm('Are you sure you want to delete this skin analysis?');
        if (!confirmDelete) return;
      await axios.delete(`/api/appointment/${appointmentId}/skin-analysis/${skinId}`);
      refreshData();
      toast.success('Skin analysis deleted successfully');
    } catch (error) {
      toast.error('Failed to delete skin analysis');
    }
  };

  const saveSkinAnalysis = async () => {
    try {
      if (editingSkin.id) {
        await axios.put(`/api/appointment/${appointmentId}/skin-analysis/${editingSkin.id}`, editingSkin);
        toast.success('Skin analysis updated successfully');
      } else {
        await axios.post(`/api/appointment/${appointmentId}/skin-analysis`, editingSkin);
        toast.success('Skin analysis added successfully');
      }
      setDialogOpen(false);
      refreshData();
    } catch (error) {
      toast.error('Failed to save skin analysis');
    }
  };

  const getSkinAnalysisTypeName = (id: number) => {
    const match = skinAnalysisTypes.find(type => type.id === id);
    return match ? match.name : id.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Skin Analysis</Label>
        <Button
          onClick={handleAddClick}
          variant="outline"
          className="gap-2"
        >
          <span>Add Analysis</span>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skin Analysis Type</TableHead>
              <TableHead>Analysis</TableHead>
              <TableHead>Abnormal</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skinAnalysisData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No skin analysis data available
                </TableCell>
              </TableRow>
            ) : (
              skinAnalysisData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getSkinAnalysisTypeName(item.skinAnalysisTypeId)}</TableCell>
                  <TableCell>{item.analysis}</TableCell>
                  <TableCell>{item.isAbnormal ? 'Yes' : 'No'}</TableCell>
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
                onCheckedChange={(checked) => setEditingSkin({
                  ...editingSkin, 
                  isAbnormal: Boolean(checked)
                })}
              />
              <Label htmlFor="is-abnormal" className="cursor-pointer">Is Abnormal</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSkinAnalysis}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}