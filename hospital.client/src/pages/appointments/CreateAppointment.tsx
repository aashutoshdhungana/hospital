import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import appointmentService from '../../services/appointmentService';
import patientService, { Patient } from '../../features/Patient/services/patientService';
import { DateTimePicker } from '../../components/ui/date-time-picker';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientInfoId: '',
    doctorInfoId: '',
    appointmentDate: new Date(),
  });

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await patientService.getPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // You might want to add error handling logic here
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientInfoId || !formData.doctorInfoId) {
      alert('Please select both a patient and a doctor');
      return;
    }

    try {
      setIsLoading(true);
      await appointmentService.createAppointment({
        patientInfoId: parseInt(formData.patientInfoId),
        doctorInfoId: parseInt(formData.doctorInfoId),
        appointmentDate: formData.appointmentDate.toISOString(),
      });
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create New Appointment</h1>
        <p className="text-muted-foreground">Schedule a new appointment for a patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <Select
              value={formData.patientInfoId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, patientInfoId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem 
                    key={patient.id} 
                    value={patient.id?.toString() || ''}
                  >
                    {`${patient.firstName} ${patient.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor</Label>
            <Select
              value={formData.doctorInfoId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, doctorInfoId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {/* Placeholder doctor options - replace with actual doctor fetching */}
                <SelectItem value="1">Dr. Smith</SelectItem>
                <SelectItem value="2">Dr. Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Appointment Date & Time</Label>
          <DateTimePicker
            date={formData.appointmentDate}
            setDate={(newDate: Date) =>
              setFormData((prev) => ({ ...prev, appointmentDate: newDate }))
            }
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            <Calendar className="mr-2 h-4 w-4" />
            {isLoading ? 'Creating...' : 'Create Appointment'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;