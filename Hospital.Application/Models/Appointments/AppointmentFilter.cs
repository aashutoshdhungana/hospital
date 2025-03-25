namespace Hospital.Application.Models.Appointments
{
    public class AppointmentFilter
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int? DoctorId { get; set; }
        public int? PatientId { get; set; }
    }
}
