using FluentValidation;
using Hospital.Application.DTOs.Doctor;

namespace Hospital.Application.Validator.Doctors
{
    public class CreateDoctorValidator : AbstractValidator<CreateDoctorDTO>
    {
        public CreateDoctorValidator()
        {
            RuleFor(x => x.Specialization)
                .NotNull()
                .WithMessage("Specialization is required.");

            RuleFor(x => x.MedicalLicenseNumber)
                .NotEmpty()
                .WithMessage("Medical license number is required.");
        }
    }
}
