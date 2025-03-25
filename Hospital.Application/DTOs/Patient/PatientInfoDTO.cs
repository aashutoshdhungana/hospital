using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.DTOs.Patient;

public class PatientInfoDTO : UserInfoDTO
{
    public string EmergencyContactPerson { get; set; }
    public string EmergencyPhoneNumber { get; set; }
}
