import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appointmentService from "@/features/Appointment/services/appointmentService";
import AppointmentForm from "@/features/Appointment/components/AppointmentForm";

const EditAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<{
    patientInfoId: string;
    doctorInfoId: string;
    appointmentDate: Date;
  } | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointment = await appointmentService.getById(
          parseInt(id!)
        );
        setInitialData({
          patientInfoId: appointment.patientId.toString(),
          doctorInfoId: appointment.doctorId.toString(),
          appointmentDate: new Date(appointment.appointmentDate),
        });
      } catch (error) {
        console.error("Error fetching appointment:", error);
        alert("Failed to load appointment data");
      }
    };

    fetchAppointment();
  }, [id]);

  const handleUpdate = async (formData: {
    patientInfoId: string;
    doctorInfoId: string;
    appointmentDate: Date;
  }) => {
    try {
      setIsLoading(true);
      await appointmentService.update(parseInt(id!), {
        patientInfoId: parseInt(formData.patientInfoId),
        doctorInfoId: parseInt(formData.doctorInfoId),
        appointmentDate: formData.appointmentDate.toISOString(),
      });
      navigate("/appointments");
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Appointment</h1>
        <p className="text-muted-foreground">
          Update the details of the appointment
        </p>
      </div>
      <AppointmentForm
        initialData={initialData}
        onSubmit={handleUpdate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditAppointment;