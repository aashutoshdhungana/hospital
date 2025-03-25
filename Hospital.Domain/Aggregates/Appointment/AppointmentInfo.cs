using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class AppointmentInfo : AuditedEntity<int>, IAggregateRoot
    {
        private AppointmentInfo() : base() { }

        public AppointmentInfo(int doctorId, int patientId, DateTime appointmentDate, int createdBy) : base(createdBy)
        {
            DoctorInfoId = doctorId;
            PatientInfoId = patientId;
            Status = AppointmentStatus.Scheduled;
            AppointmentDate = appointmentDate;
        }

        public DateTime AppointmentDate { get; private set; }
        public int DoctorInfoId { get; private set; }
        public int PatientInfoId { get; private set; }
        public AppointmentStatus Status { get; private set; }
        public Patient.PatientInfo PatientInfo { get; private set; }
        public Doctor.DoctorInfo DoctorInfo { get; private set; }
    }
}
