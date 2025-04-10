using FluentValidation;
using Hospital.Application.DTOs.Doctor;

namespace Hospital.Application.Validator.Doctors
{
    public class UpdateDoctorValidator : AbstractValidator<UpdateDoctorDTO>
    {
        public UpdateDoctorValidator()
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
