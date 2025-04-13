using FluentValidation;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.UserInfo;

namespace Hospital.Application.Validator.UserInfo
{
    public class CreateUserInfoValidator : AbstractValidator<CreateUserInfoDTO>
    {
        public CreateUserInfoValidator(
            IUserInfoRepository userInfoRepository
            )
        {
            RuleFor(x => x.Email)
                .EmailAddress()
                .WithMessage("Email address is invalid.")
                .MustAsync(async (email, cancellationToken) =>
                {
                    if (!string.IsNullOrEmpty(email))
                        return true;
                    var exist = await userInfoRepository.ExistsByEmail(email);
                    return !exist;
                })
                .WithMessage("User with email already exists");

            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

            RuleFor(x => x.MiddleName)
                .MaximumLength(50).WithMessage("Middle name cannot exceed 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^\+?[0-9]{7,15}$").WithMessage("Invalid phone number format")
                .MustAsync(async (phone, cancellationToken) =>
                {
                    var exist = await userInfoRepository.ExistsByPhoneNumber(phone);
                    return !exist;
                })
                .WithMessage("User with phone number already exists");

            RuleFor(x => x.Gender)
                .IsInEnum().WithMessage("Invalid gender selection");

            RuleFor(x => x.Street)
                .MaximumLength(100).WithMessage("Street name cannot exceed 100 characters");

            RuleFor(x => x.City)
                .MaximumLength(50).WithMessage("City name cannot exceed 50 characters");

            RuleFor(x => x.State)
                .MaximumLength(50).WithMessage("State name cannot exceed 50 characters");

            RuleFor(x => x.Country)
                .MaximumLength(50).WithMessage("Country name cannot exceed 50 characters");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required");
        }
    }
}
