using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class AppointmentDiagnosis : AuditedEntity<int>
    {
        private AppointmentDiagnosis() { }
        public AppointmentDiagnosis(int apointmentInfoId, int diagnosisInfoId, string? remarks, int createdBy) : base(createdBy)
        {
            ApointmentInfoId = apointmentInfoId;
            DiagnosisInfoId = diagnosisInfoId;
            Remarks = remarks;
        }

        public void Update(int diagnosisInfoId, string remarks, int updatedBy)
        {
            DiagnosisInfoId = diagnosisInfoId;
            Remarks = remarks;
            Updated(updatedBy);
        }
        public int ApointmentInfoId { get; set; }
        public int DiagnosisInfoId { get; set; }
        public string? Remarks { get; set; }
        public AppointmentInfo AppointmentInfo { get; set; }
        public DiagnosisInfo DiagnosisInfo { get; set; }
    }
}
