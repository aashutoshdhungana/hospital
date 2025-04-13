namespace Hospital.Application.DTOs.MedicalAssesment
{
    public class MedicalAssesmentDTO
    {
        public int Id { get; set; }
        public string ChiefComplaint { get; set; }
        public string HistoryOfIllness { get; set; }
        public string Diagnosis { get; set; }
        public string Advice { get; set; }
        public int AppointmentInfoId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
