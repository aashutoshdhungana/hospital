using Hospital.Application.Constants;
using Hospital.Application.Interfaces;
using System.Security.Claims;

namespace Hospital.Server.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public int? UserId
        {
            get 
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(x => x.Type == ApplicationClaims.UserId);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return null;
                }
                return userId;
            }
        }
    }
}
