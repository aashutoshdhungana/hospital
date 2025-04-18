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
import Patient from "@/features/Patient/schema/PatientSchema";
import axios from "axios";

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
  const [doctors, setDoctors] = useState<{ id: number, firstName: string, lastName: string }[]>([]);
  const [formData, setFormData] = useState({
    patientInfoId: initialData?.patientInfoId || "",
    doctorInfoId: initialData?.doctorInfoId || "",
    appointmentDate: initialData?.appointmentDate || new Date(),
  });

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/doctor");
        if (response.status == 200 && response.data) {
          setDoctors(response.data.map((x: { id: number, userInfo: { id: number, firstName: string, lastName: string } }) => ({
            id: x.id,
            firstName: x.userInfo.firstName,
            lastName: x.userInfo.lastName
          })));
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patient");
        if (response.status == 200 && response.data) {
          setPatients(response.data.map((x: { id: number, userInfo: { id: number, firstName: string, lastName: string } }) => ({
            id: x.id,
            firstName: x.userInfo.firstName,
            lastName: x.userInfo.lastName
          })));
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchDoctors();
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id?.toString()}>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id?.toString()}>
                  {`${doctor.firstName} ${doctor.lastName}`}
                </SelectItem>
              ))}
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
        <Button type="submit" disabled={isLoading} className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;