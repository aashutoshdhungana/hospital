using FluentValidation;
using Hospital.Application.DTOs.UserInfo;

namespace Hospital.Application.Validator.UserInfo
{
    public class UpdateUserInfoValidator : AbstractValidator<UpdateUserInfoDTO>
    {
        public UpdateUserInfoValidator()
        {
            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

            RuleFor(x => x.MiddleName)
                .MaximumLength(50).WithMessage("Middle name cannot exceed 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

            RuleFor(x => x.Gender)
                .IsInEnum().WithMessage("Invalid gender selection");

            RuleFor(x => x.Street)
                .NotEmpty().WithMessage("Street is required")
                .MaximumLength(100).WithMessage("Street name cannot exceed 100 characters");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required")
                .MaximumLength(50).WithMessage("City name cannot exceed 50 characters");

            RuleFor(x => x.State)
                .NotEmpty().WithMessage("State is required")
                .MaximumLength(50).WithMessage("State name cannot exceed 50 characters");

            RuleFor(x => x.Country)
                .NotEmpty().WithMessage("Country is required")
                .MaximumLength(50).WithMessage("Country name cannot exceed 50 characters");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required");
        }
    }
}
