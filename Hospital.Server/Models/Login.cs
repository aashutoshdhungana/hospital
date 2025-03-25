using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.UserInfo;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Hospital.Server.Models
{
    public class Login
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class LoginResponse
    {
        public UserInfoDTO UserInfo { get; set; }
        public IReadOnlyCollection<string> Permissions { get; set; }
        public IReadOnlyCollection<string> Roles { get; set; }
    }
}
