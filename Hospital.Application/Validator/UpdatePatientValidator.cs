using FluentValidation;
using Hospital.Application.DTOs.Patient;

namespace Hospital.Application.Validator
{
    public class UpdatePatientValidator : AbstractValidator<UpdatePatientDTO>
    {
        public UpdatePatientValidator()
        {

        }
    }
}
