using Hospital.Application.DTOs.UserInfo;
using System.Security.Claims;

namespace Hospital.Application.DTOs.Login
{
    public class LoginResponse
    {
        public UserInfoDTO UserInfo { get; set; }
        public ClaimsPrincipal ClaimPrincipal { get; set; }
        public List<string> Permissions { get; set; }
        public List<string> Roles { get; set; }
    }
}
