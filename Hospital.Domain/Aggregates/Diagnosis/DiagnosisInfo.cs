using Hospital.Domain.Aggregates.Rx;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Diagnosis
{
    public class DiagnosisInfo : AuditedEntity<int>, IAggregateRoot
    {
        private DiagnosisInfo() { }

        public string DiagnosisText { get; private set; }
        public string? Code { get; private set; }

        private readonly List<RxInfo> _prescriptions = new();
        public IReadOnlyCollection<RxInfo> Prescriptions => _prescriptions.AsReadOnly();

        public DiagnosisInfo(string diagnosisText, string? code, int createdBy) : base(createdBy)
        {
            DiagnosisText = diagnosisText;
            Code = code;
        }

        public void Update(string diagnosisText, string? code, int updatedBy)
        {
            DiagnosisText = diagnosisText;
            Code = code;
            Updated(updatedBy);
        }

        public void AddPrescription(RxInfo rxInfo)
        {
            _prescriptions.Add(rxInfo);
        }

        public void RemovePrescription(RxInfo rxInfo)
        {
            _prescriptions.Remove(rxInfo);
        }
    }
}
