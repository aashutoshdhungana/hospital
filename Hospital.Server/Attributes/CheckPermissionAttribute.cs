using Hospital.Application.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Hospital.Server.Attributes
{
    public class CheckPermissionAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _requiredPermissions;
        public CheckPermissionAttribute(params string[] requiredPermissions)
        {
            _requiredPermissions = requiredPermissions;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (user == null)
            {
                context.Result = new ForbidResult();
                return;
            }

            if (user.IsInRole("Admin"))
                return;

            if (user.HasClaim(c => c.Type == ApplicationClaims.Permission && c.Value == "*"))
                return;

            if (_requiredPermissions.Any(perm =>
                user.HasClaim(c => c.Type == ApplicationClaims.Permission && c.Value == perm)))
                return;

            context.Result = new ForbidResult();
        }
    }
}
