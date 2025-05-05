using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class SkinAnalysisType : AuditedEntity<int>
    {
        public SkinAnalysisType()
        {
            
        }

        public SkinAnalysisType(string name, int createdBy) : base(createdBy)
        {
            Name = name;
        }

        public string Name { get; private set; }
        public readonly List<SkinAnalysis> SkinAnalyses = new List<SkinAnalysis>();
    }
}