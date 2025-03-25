using Microsoft.AspNetCore.Identity;

namespace Hospital.Infrastructure.Identity.IdentityValidator
{
    public class OptionalEmailUserValidator<TUser> : UserValidator<TUser> where TUser : IdentityUser
    {
        public OptionalEmailUserValidator(IdentityErrorDescriber errors = null) : base(errors)
        {
        }

        public override async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
        {
            var result = await base.ValidateAsync(manager, user);
            if (!result.Succeeded && string.IsNullOrWhiteSpace(await manager.GetEmailAsync(user)))
            {
                var errors = result.Errors.Where(e => e.Code != "InvalidEmail");
                result = errors.Count() > 0 ? IdentityResult.Failed(errors.ToArray()) : IdentityResult.Success;
            }
            return result;
        }
    }
}
