namespace Hospital.Application.DTOs.MedicationPrescribed
{
    public class MedicationPrescribedDTO
    {
        public int Id { get; set; }
        public int RxId { get; set; }
        public string ApplicationType { get; set; }
        public int TimesPerDay { get; set; }
        public int DurationInDays { get; set; }
        public DateTime StartDate { get; set; }
        public string Remarks { get; set; }
        public int AppointmentInfoId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreateAt { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
