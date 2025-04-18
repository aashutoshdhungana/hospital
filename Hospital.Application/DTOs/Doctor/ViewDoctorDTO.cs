using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.Doctor;

namespace Hospital.Application.DTOs.Doctor
{
    public class ViewDoctorDTO
    {
        public int Id { get; set; }
        public Specialization Specialization { get; set; }
        public string MedicalLicenseNumber { get; set; }
        public double PastExperienceInYears { get; set; }
        public UserInfoDTO UserInfo { get; set; }
    }
}
