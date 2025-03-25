using Hospital.Application.Constants;
using Hospital.Application.Interfaces;
using Hospital.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : BaseApiController
    {
        private readonly IUserIdentityService _userIdentityService;
        public LoginController(IUserIdentityService userIdentityService)
        {
            _userIdentityService = userIdentityService;
        }

        [HttpGet("checkauth")]
        [Authorize]
        public async Task<ActionResult<LoginResponse>> CheckAuth()
        {
            var loginResponse = await _userIdentityService.GetUserDetails(HttpContext.User);
            if (loginResponse.ResultType != ResultTypes.Success)
                return HandleServiceResult(loginResponse);
            return Ok(new LoginResponse()
            {
                UserInfo = loginResponse.Data!.UserInfo,
                Permissions = loginResponse.Data?.Permissions ?? new List<string>(),
                Roles = loginResponse.Data?.Roles ?? new List<string>()
            });
        }

        [HttpPost]
        public async Task<ActionResult<LoginResponse>> LoginAsync(Login login)
        {
            var result = await _userIdentityService.Login(login.Username, login.Password);
            if (result.ResultType == ResultTypes.NotFound)
                return BadRequest("User not registerd");

            if (result.ResultType != ResultTypes.Success)
                return HandleServiceResult(result);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                result.Data!.ClaimPrincipal,
                new AuthenticationProperties()
                {
                    IsPersistent = login.RememberMe
                });

            return Ok(
                new LoginResponse()
                {
                    UserInfo = result.Data!.UserInfo,
                    Permissions = result.Data?.Permissions ?? new List<string>(),
                    Roles = result.Data?.Roles ?? new List<string>()
                }
            );
        }
    }
}
