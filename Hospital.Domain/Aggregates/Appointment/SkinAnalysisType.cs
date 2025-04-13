using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class SkinAnalysisType : AuditedEntity<int>
    {
        public string Name { get; set; }
        public readonly List<SkinAnalysis> SkinAnalyses = new List<SkinAnalysis>();
    }
}