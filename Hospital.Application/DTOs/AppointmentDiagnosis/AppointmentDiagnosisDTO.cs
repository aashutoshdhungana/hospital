namespace Hospital.Application.DTOs.AppointmentDiagnosis
{
    public class AppointmentDiagnosisDTO
    {
        public int Id { get; set; }
        public int ApointmentInfoId { get; set; }
        public int DiagnosisInfoId { get; set; }
        public string DiagnosisText { get; set; }
        public string Code { get; set; }
        public string Remarks { get; set; }
    }
}
