namespace Hospital.Application.DTOs.SkinAnalysis
{
    public class CreateUpdateSkinAnalysisDTO
    {
        public int SkinAnalysisTypeId { get; set; }
        public string Analysis { get; set; }
        public bool IsAbnormal { get; set; }
        public int AppointmentInfoId { get; set; }
    }
}
