import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import patientService from "@/features/Patient/services/patientService";
import Patient from "@/features/Patient/schema/PatientSchema";

interface AppointmentFormProps {
  initialData?: {
    patientInfoId: string;
    doctorInfoId: string;
    appointmentDate: Date;
  };
  onSubmit: (formData: {
    patientInfoId: string;
    doctorInfoId: string;
    appointmentDate: Date;
  }) => Promise<void>;
  isLoading: boolean;
}

const AppointmentForm = ({
  initialData,
  onSubmit,
  isLoading,
}: AppointmentFormProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientInfoId: initialData?.patientInfoId || "",
    doctorInfoId: initialData?.doctorInfoId || "",
    appointmentDate: initialData?.appointmentDate || new Date(),
  });

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await patientService.getPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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
                  value={patient.id?.toString() || ""}
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
          {isLoading ? "Saving..." : "Save Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;