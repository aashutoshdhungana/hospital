using FluentValidation;
using Hospital.Application.DTOs.RxInfo;

namespace Hospital.Application.Validator.RxInfo
{
    public class CreateRxInfoValidator : AbstractValidator<CreateUpdateRxInfoDTO>
    {
        public CreateRxInfoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Required");

            RuleFor(x => x.Type)
                .NotEmpty()
                .WithMessage("Required");

            RuleFor(x => x.Remarks)
                .MaximumLength(150)
                .WithMessage("Remarks should be less than 150 characters");
        }
    }
}
