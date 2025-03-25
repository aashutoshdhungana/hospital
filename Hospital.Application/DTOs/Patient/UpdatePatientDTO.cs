using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.DTOs.Patient
{
    public class UpdatePatientDTO : CreateUpdateUserInfoDTO
    {
        public string EmergencyContactPerson { get; set; }
        public string EmergencyPhoneNumber { get; set; }
    }
}
