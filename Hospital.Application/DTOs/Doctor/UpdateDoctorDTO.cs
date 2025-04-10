using Hospital.Domain.Aggregates.Doctor;

namespace Hospital.Application.DTOs.Doctor
{
    public class UpdateDoctorDTO
    {
        public string MedicalLicenseNumber { get; set; }
        public double PastExperienceInYears { get; set; }
        public Specialization Specialization { get; set; }
    }
}
