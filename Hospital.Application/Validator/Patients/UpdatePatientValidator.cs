using FluentValidation;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.Validator.Patients
{
    public class UpdatePatientValidator : AbstractValidator<UpdatePatientDTO>
    {
        public UpdatePatientValidator(IValidator<UpdateUserInfoDTO> userInfoValidator)
        {
            Include(userInfoValidator);

            RuleFor(x => x.EmergencyContactNumber)
                .NotEmpty().WithMessage("Emergency contact number is required");

            RuleFor(x => x.EmergencyContactPerson)
                .NotEmpty().WithMessage("Emergency contact person is required");
        }
    }
}
