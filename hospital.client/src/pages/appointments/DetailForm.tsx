// src/components/AppointmentForm.tsx
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { DiagnosisRecord } from './DiagnosisTable';
// Import our new table components
import SkinAnalysisTable, { SkinAnalysis } from './SkinAnalysisTable';
import MedicationsTable, { Medication } from './MedicationTable';
import DiagnosesTable from './DiagnosisTable';

export default function AppointmentForm() {
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfIllness, setHistoryOfIllness] = useState('');
  const [advice, setAdvice] = useState('');

  const [skinAnalysisData, setSkinAnalysisData] = useState<SkinAnalysis[]>([]);
  const [medicationsData, setMedicationsData] = useState<Medication[]>([]);


  

  const [diagnosisData, setDiagnosisData] = useState<DiagnosisRecord[]>([]);

  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const { id } = useParams<{ id: string }>();

  const getSkinAnalysisData = async () => {
    try {
      let response = await axios.get(`/api/appointment/${id}/skin-analysis`);
      let data = response.data as SkinAnalysis[];
      setSkinAnalysisData(data);
    } catch (error) {
      toast.error('Failed to load skin analysis data');
      setSkinAnalysisData([]);
    }
  };

  const getMedicationsData = async () => {
    try {
      let response = await axios.get(`/api/appointment/${id}/medications`);
      let data = response.data as Medication[];
      setMedicationsData(data);
    } catch (error) {
      toast.error('Failed to load medication data');
      setMedicationsData([]);
    }
  };

  const getAssessmentData = async () => {
    try {
      let response = await axios.get(`/api/appointment/${id}`);
      const { chiefComplaint, historyOfIllness, advice } = response.data.medicalAssesment ?? {};
      setChiefComplaint(chiefComplaint || '');
      setHistoryOfIllness(historyOfIllness || '');
      setAdvice(advice || '');
      setPatientName(response.data.patientName || '');
      setDoctorName(response.data.doctorName || '');
    } catch (error) {
      toast.error('Failed to load assessment data');
    }
  };

  const getDiagnosisData = async () => {
    try {
      let response = await axios.get(`/api/appointment/${id}/diagnoses`);
      let data = response.data as DiagnosisRecord[];
      setDiagnosisData(data);
    } catch (error) {
      toast.error('Failed to load diagnosis data');
      setDiagnosisData([]);
    }

  }
  useEffect(() => {

    if (id) {
      getSkinAnalysisData();
      getMedicationsData();
      getAssessmentData();
      getDiagnosisData();
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/appointment/${id}/assessment`, {
        chiefComplaint,
        historyOfIllness,
        advice,
      });
      getAssessmentData();
      toast.success('Assessment saved successfully!');
    } catch (error) {
      toast.error('Failed to save assessment');
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>
          Medical Assessment {patientName ? `for ${patientName}` : null} {doctorName ? `by ${doctorName}` : ''}
        </CardTitle>
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

        {/* Skin Analysis Table Component */}
        <SkinAnalysisTable
          appointmentId={id || ''}
          skinAnalysisData={skinAnalysisData}
          refreshData={getSkinAnalysisData}
        />

        <DiagnosesTable
            appointmentId={id || ''}
            diagnosesData={diagnosisData}
            refreshData={() => {
                getDiagnosisData();
                getMedicationsData();
            }}
        />

        {/* Medications Table Component */}
        <MedicationsTable
          appointmentId={id || ''}
          medicationsData={medicationsData}
          refreshData={getMedicationsData}
        />

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
    </Card>
  );
}