using FluentValidation;
using Hospital.Application.DTOs.Patient;

namespace Hospital.Application.Validator.Patients
{
    public class UpdatePatientValidator : AbstractValidator<UpdatePatientDTO>
    {
        public UpdatePatientValidator()
        {
            RuleFor(x => x.EmergencyContactNumber)
                .NotEmpty().WithMessage("Emergency contact number is required");

            RuleFor(x => x.EmergencyContactPerson)
                .NotEmpty().WithMessage("Emergency contact person is required");
        }
    }
}
