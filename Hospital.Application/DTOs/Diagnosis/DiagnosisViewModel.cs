using Hospital.Application.DTOs.RxInfo;

namespace Hospital.Application.DTOs.Diagnosis
{
    public class DiagnosisViewModel
    {
        public int Id { get; set; }
        public string DiagnosisText { get; set; }
        public string Code { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public List<RxInfoDTO> Prescriptions { get; set; } = new();
    }
}
