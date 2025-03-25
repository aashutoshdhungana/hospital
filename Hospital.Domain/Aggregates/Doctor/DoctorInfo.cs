using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Doctor
{
    public class DoctorInfo : AuditedEntity<int>, IAggregateRoot
    {
        private DoctorInfo() : base() { }

        public DoctorInfo(
            UserInfo.UserInfo userInfo,
            Specialization specializations,
            int createdBy
        ) : base(createdBy)
        {
            UserInfo = userInfo;
            Specialization = specializations;
        }
        public int UserInfoId { get; private set; }
        public Specialization Specialization { get; private set; }
        public UserInfo.UserInfo UserInfo { get; private set; }
    }
}
