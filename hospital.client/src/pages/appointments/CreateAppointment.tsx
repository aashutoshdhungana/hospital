import { useState } from "react";
import { useNavigate } from "react-router-dom";
import appointmentService from "@/features/Appointment/services/appointmentService";
import AppointmentForm from "@/features/Appointment/components/AppointmentForm";
import { toast } from "sonner";

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (formData: {
    patientInfoId: string;
    doctorInfoId: string;
    appointmentDate: Date;
  }) => {
    try {
      setIsLoading(true);
      await appointmentService.create({
        patientInfoId: parseInt(formData.patientInfoId),
        doctorInfoId: parseInt(formData.doctorInfoId),
        appointmentDate: formData.appointmentDate.toISOString(),
      });
      toast.success("Appointment created successfully!");
      navigate("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (<div className="p-6 max-w-2xl mx-auto">
          <div className="mb-6">
              <h1 className="text-2xl font-semibold">Create New Appointment</h1>
              <p className="text-muted-foreground">
                Schedule a new appointment for a patient
              </p>
          </div>
          <AppointmentForm onSubmit={handleCreate} isLoading={isLoading} />
      </div>
    )
};

export default CreateAppointment;