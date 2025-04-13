namespace Hospital.Application.DTOs.Patient;

public class CreatePatientDTO
{
    public int UserInfoId { get; set; }
    public string EmergencyContactPerson { get; set; }
    public string EmergencyContactNumber { get; set; }
}
