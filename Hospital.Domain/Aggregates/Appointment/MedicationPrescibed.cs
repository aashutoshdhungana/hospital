using Hospital.Domain.Aggregates.Rx;
using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class MedicationPrescibed : AuditedEntity<int>
    {
        public int RxId { get; private set; }
        public RxInfo? RxInfo { get; private set; }
        public string ApplicationType { get; private set; }
        public int TimesPerDay { get; private set; }
        public int DurationInDays { get; private set; }
        public DateTime StartDate { get; private set; }
        public string? Remarks { get; private set; }
        public int AppointmentInfoId { get; private set; }
        public AppointmentInfo? AppointmentInfo { get; private set; }
        private MedicationPrescibed()
        {
        }

        public MedicationPrescibed(
            int createdBy,
            int appointmentInfoId,
            int rxId,
            string applicationType,
            int timesPerDay,
            int durationInDays,
            DateTime startDate,
            string? remarks = null)
            : base(createdBy)
        {
            RxId = rxId;
            AppointmentInfoId = appointmentInfoId;
            ApplicationType = applicationType;
            TimesPerDay = timesPerDay;
            DurationInDays = durationInDays;
            StartDate = startDate;
            Remarks = remarks;
        }

        public void Update(
            int updatedBy,
            int rxId,
            string applicationType,
            int timesPerDay,
            int durationInDays,
            DateTime startDate,
            string? remarks = null)
        {
            RxId = rxId;
            ApplicationType = applicationType;
            TimesPerDay = timesPerDay;
            DurationInDays = durationInDays;
            StartDate = startDate;
            Remarks = remarks;
            Updated(updatedBy);
        }
    }
}
