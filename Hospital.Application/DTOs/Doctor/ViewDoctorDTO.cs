using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.Doctor;

namespace Hospital.Application.DTOs.Doctor
{
    public class ViewDoctorDTO : UserInfoDTO
    {
        public Specialization Specialization { get; set; }
    }
}
