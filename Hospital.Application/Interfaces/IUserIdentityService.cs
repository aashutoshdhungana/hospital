using Hospital.Application.DTOs.Login;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.UserInfo;
using System.Security.Claims;

namespace Hospital.Application.Interfaces
{
    public interface IUserIdentityService
    {
        Task<ServiceResult<LoginResponse>> GetUserDetails(ClaimsPrincipal claimsPrincipal);
        Task<ServiceResult<LoginResponse>> Login(string username, string password);
        Task<ServiceResult<string>> RegisterUser(UserInfo userInfo, string password);
    }
}
