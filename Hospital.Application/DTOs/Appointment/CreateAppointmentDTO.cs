namespace Hospital.Application.DTOs.Appointment
{
    public class CreateAppointmentDTO
    {
        public int PatientInfoId { get; set; }
        public int DoctorInfoId { get; set; }
        public DateTime AppointmentDate { get; set; }
    }
}
