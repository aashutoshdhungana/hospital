using Hospital.Domain.Aggregates.Doctor;

namespace Hospital.Application.DTOs.Doctor
{
    public class CreateDoctorDTO
    {
        public int UserInfoId { get; set; }
        public string MedicalLicenseNumber { get; set; }
        public double PastExperienceInYears { get; set; }
        public Specialization Specialization { get; set; }
    }
}
