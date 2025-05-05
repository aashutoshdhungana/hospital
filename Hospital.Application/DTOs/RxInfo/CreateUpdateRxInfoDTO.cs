namespace Hospital.Application.DTOs.RxInfo
{
    public class CreateUpdateRxInfoDTO
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int DiagnosisId { get; set; }
        public string Remarks { get; set; }
    }
}
