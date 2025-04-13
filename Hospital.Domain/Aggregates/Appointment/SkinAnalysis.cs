using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class SkinAnalysis : AuditedEntity<int>
    {
        public int SkinAnalysisTypeId { get; private set; }
        public SkinAnalysisType? SkinAnalysisType { get; private set; }
        public string Analysis { get; private set; }
        public bool IsAbnormal { get; private set; }
        public int AppointmentInfoId { get; private set; }
        public AppointmentInfo? AppointmentInfo { get; private set; }

        public SkinAnalysis()
        {
        }

        public SkinAnalysis(
            int skinAnalysisTypeId,
            int appointmentInfoId,
            string analysis,
            bool isAbnormal,
            int createdBy
            ) : base(createdBy)
        {
            AppointmentInfoId = appointmentInfoId;
            SkinAnalysisTypeId = skinAnalysisTypeId;
            Analysis = analysis;
            IsAbnormal = isAbnormal;
        }

        public void Update(
            int skinAnalysisTypeId,
            string analysis,
            bool isAbnormal,
            int updatedBy
            )
        {
            SkinAnalysisTypeId = skinAnalysisTypeId;
            Analysis = analysis;
            IsAbnormal = isAbnormal;
        }
    }
}