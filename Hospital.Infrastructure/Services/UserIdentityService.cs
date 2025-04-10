using Hospital.Application.Constants;
using Hospital.Application.DTOs.Login;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Infrastructure.Identity.Models;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace Hospital.Infrastructure.Services
{
    public class UserIdentityService : IUserIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly ISMSService _sMSService;
        private readonly IConfiguration _configuration;
        private readonly IUserClaimsPrincipalFactory<User> _userClaimPrincipalFactory;
        private readonly IUserInfoRepository _userInfoRepository;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserIdentityService(
            UserManager<User> userManager,
            ISMSService sMSService,
            IConfiguration configuration,
            IUserClaimsPrincipalFactory<User> userClaimPrincipalFactory,
            IUserInfoRepository userInfoRepository,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _sMSService = sMSService;
            _configuration = configuration;
            _userClaimPrincipalFactory = userClaimPrincipalFactory;
            _userInfoRepository = userInfoRepository;
            _roleManager = roleManager;
        }
        public async Task<ServiceResult<LoginResponse>> GetUserDetails(ClaimsPrincipal claimsPrincipal)
        {
            var user = await _userManager.GetUserAsync(claimsPrincipal);
            if (user == null)
            {
                return ServiceResult<LoginResponse>.Unauthorized();
            }

            var userInfo = await _userInfoRepository.GetById(user.UserInfoId);
            if (userInfo == null)
            {
                return ServiceResult<LoginResponse>.Unauthorized();
            }

            var loginResponse = new LoginResponse()
            {
                UserInfo = userInfo.Adapt<UserInfoDTO>(),
                ClaimPrincipal = claimsPrincipal,
                Permissions = [.. claimsPrincipal.Claims.Where(x => x.Type == ApplicationClaims.Permission).Select(x => x.Value)],
                Roles = [.. claimsPrincipal.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => x.Value)]
            };
            return ServiceResult<LoginResponse>.Success(loginResponse);
        }

        public async Task<ServiceResult<string>> RegisterUser(UserInfo userInfo, string password)
        {
            var user = new User()
            {
                Email = userInfo.Email,
                UserName = userInfo.PhoneNumber,
                PhoneNumber = userInfo.PhoneNumber,
                UserInfo = userInfo,
            };
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                return ServiceResult<string>.Failure("Failed to create user.");
            }

            // TODO add background tasks
            await _sMSService.SendSMSMessage($"""
                Account created in the system {_configuration.GetSection("CompanyName")}
                Username: {user.PhoneNumber}
                Password: {password}
                """, user.PhoneNumber);

            return ServiceResult<string>.Success("Created user successfully");
        }

        public async Task<ServiceResult<string>> AddUserToRole(string username, string role)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return ServiceResult<string>.NotFound();

            var isInRole = await _userManager.IsInRoleAsync(user, role);

            if (isInRole)
                return ServiceResult<string>.Success("Created successfully");

            var dbRole = await _roleManager.FindByNameAsync(role);
            if (dbRole == null)
                return ServiceResult<string>.NotFound();

            var identityResult = await _userManager.AddToRoleAsync(user, role);
            return identityResult.Succeeded ? ServiceResult<string>.Success("Created successfully")
                : ServiceResult<string>.Failure("Failed to add to role");
        }

        public async Task<ServiceResult<string>> RemoveUserFromRole(string username, string role)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return ServiceResult<string>.NotFound();

            var isInRole = await _userManager.IsInRoleAsync(user, role);
            if (!isInRole)
                return ServiceResult<string>.Success("Removed from role");

            var result = await _userManager.RemoveFromRoleAsync(user, role);

            return result.Succeeded ? ServiceResult<string>.Success("Removed from role")
                : ServiceResult<string>.Failure("Failed to remove from role");
        }

        public async Task<ServiceResult<LoginResponse>> Login(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return ServiceResult<LoginResponse>.NotFound();

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);
            if (!isPasswordValid)
                return ServiceResult<LoginResponse>.Failure("Invalid credentials.");

            var userClaimsPrincipal = await _userClaimPrincipalFactory.CreateAsync(user);

            var userInfo = await _userInfoRepository.GetById(user.UserInfoId);
            var loginResponse = new LoginResponse()
            {
                UserInfo = userInfo.Adapt<UserInfoDTO>(),
                ClaimPrincipal = userClaimsPrincipal,
                Permissions = [.. userClaimsPrincipal.Claims.Where(x => x.Type == ApplicationClaims.Permission).Select(x => x.Value)],
                Roles = [.. userClaimsPrincipal.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => x.Value)]
            };

            return ServiceResult<LoginResponse>.Success(loginResponse);
        }
    }
}
