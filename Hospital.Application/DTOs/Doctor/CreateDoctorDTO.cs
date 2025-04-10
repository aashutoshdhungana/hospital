using Hospital.Domain.Aggregates.Doctor;

namespace Hospital.Application.DTOs.Doctor
{
    public class CreateDoctorDTO
    {
        public string MedicalLicenseNumber { get; private set; }
        public double PastExperienceInYears { get; private set; }
        public Specialization Specialization { get; set; }
    }
}
