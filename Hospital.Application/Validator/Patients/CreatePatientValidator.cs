using FluentValidation;
using Hospital.Application.DTOs.Patient;

namespace Hospital.Application.Validator.Patients
{
    public class CreatePatientValidator : AbstractValidator<CreatePatientDTO>
    {
        public CreatePatientValidator()
        {
            RuleFor(x => x.EmergencyContactNumber)
                .NotEmpty().WithMessage("Emergency contact number is required");

            RuleFor(x => x.EmergencyContactPerson)
                .NotEmpty().WithMessage("Emergency contact person is required");
        }
    }
}
