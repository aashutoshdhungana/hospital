using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.DTOs.Patient;

public class CreatePatientDTO : CreateUpdateUserInfoDTO
{
    public string EmergencyContactPerson { get; set; }
    public string EmergencyContactNumber { get; set; }
}
