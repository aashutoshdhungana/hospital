using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Rx
{
    public class RxInfo : AuditedEntity<int>, IAggregateRoot
    {
        private RxInfo() { }

        public string Name { get; private set; }
        public string Type { get; private set; }
        public string? Remarks { get; private set; }
        public int? DiagnosisId { get; private set; }
        public Diagnosis.DiagnosisInfo Diagnosis { get; private set; }

        public readonly List<MedicationPrescibed> MedicationPrescibed = new();

        public RxInfo(string name, string type, string remarks, int diagnosisId, int createdBy)
            : base(createdBy)
        {
            Name = name;
            Type = type;
            Remarks = remarks;
            DiagnosisId = diagnosisId;
        }

        public void Update(string name, string type, string remarks, int diagnosisId, int updatedBy)
        {
            Name = name;
            Type = type;
            Remarks = remarks;
            DiagnosisId = diagnosisId;
            Updated(updatedBy);
        }
    }

}
