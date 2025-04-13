using Hospital.Domain.Aggregates.UserInfo;
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
            string medicalLicenseNumber,
            double pastExperience,
            int createdBy
        ) : base(createdBy)
        {
            UserInfo = userInfo;
            MedicalLicenseNumber = medicalLicenseNumber;
            PastExperienceInYears = pastExperience;
            Specialization = specializations;
        }
        public int UserInfoId { get; private set; }
        public string MedicalLicenseNumber { get; private set; }
        public double PastExperienceInYears { get; private set; }
        public Specialization Specialization { get; private set; }
        public double CurrentExperience {
            get {
                var startDate = CreatedAt;
                var endDate = DateTime.UtcNow;
                int totalMonths = ((endDate.Year - startDate.Year) * 12) + endDate.Month - startDate.Month;

                // Adjust for day-of-month
                if (endDate.Day < startDate.Day)
                {
                    totalMonths -= 1;
                }

                // Convert months to years with 1 decimal place
                double years = Math.Round(totalMonths / 12.0, 1);
                return years;
            }
        }
        public UserInfo.UserInfo UserInfo { get; private set; }

        public void Update(
            string medicalLicenseNumber,
            double pastExperienceInYears,
            Specialization specialization,
            int updatedBy
            )
        {
            MedicalLicenseNumber = medicalLicenseNumber;
            PastExperienceInYears = pastExperienceInYears;
            Specialization = specialization;
            Updated(updatedBy);
        }
    }
}
