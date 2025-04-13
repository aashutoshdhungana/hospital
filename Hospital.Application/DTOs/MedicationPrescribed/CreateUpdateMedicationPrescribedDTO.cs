namespace Hospital.Application.DTOs.MedicationPrescribed
{
    public class CreateUpdateMedicationPrescribedDTO
    {
        public int RxId { get; set; }
        public string ApplicationType { get; set; }
        public int TimesPerDay { get; set; }
        public int DurationInDays { get; set; }
        public DateTime StartDate { get; set; }
        public string Remarks { get; set; }
        public int AppointmentInfoId { get; set; }
    }
}
