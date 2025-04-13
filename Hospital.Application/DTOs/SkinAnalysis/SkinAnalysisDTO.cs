namespace Hospital.Application.DTOs.SkinAnalysis
{
    public class SkinAnalysisDTO
    {
        public int Id { get; set; }
        public int SkinAnalysisTypeId { get; set; }
        public string Analysis { get; set; }
        public bool IsAbnormal { get; set; }
        public int AppointmentInfoId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
