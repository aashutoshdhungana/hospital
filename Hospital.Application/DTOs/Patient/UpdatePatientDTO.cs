using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.DTOs.Patient
{
    public class UpdatePatientDTO : UpdateUserInfoDTO
    {
        public string EmergencyContactPerson { get; set; }
        public string EmergencyContactNumber { get; set; }
    }
}
