using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.DTOs.Patient;

public class PatientInfoDTO
{
    public int Id { get; set; }
    public string EmergencyContactPerson { get; set; }
    public string EmergencyPhoneNumber { get; set; }
    public UserInfoDTO UserInfo { get; set; }
}
