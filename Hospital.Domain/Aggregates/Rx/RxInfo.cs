using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;
using System.Collections.ObjectModel;

namespace Hospital.Domain.Aggregates.Rx
{
    public class RxInfo : AuditedEntity<int>, IAggregateRoot
    {
        private RxInfo() { }
        public string Name { get; private set; }
        public string Type { get; private set; }
        public string? Remarks { get; private set; }
        public readonly List<MedicationPrescibed> MedicationPrescibed = new List<MedicationPrescibed>();
        public RxInfo(
            string name,
            string type,
            string remarks,
            int createdBy
            ) : base(createdBy)
        {
            Name = name;
            Type = type;
            Remarks = remarks;
        }

        public void Update(
            string name,
            string type,
            string remarks,
            int updatedBy
            )
        {
            Name = name;
            Type = type;
            Remarks = remarks;
            Updated(updatedBy);
        }
    }
}
