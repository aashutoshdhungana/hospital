using Hospital.Application.Constants;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Server.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserInfoController : BaseApiController
    {
        private readonly IUserInfoService _userInfoService;
        public UserInfoController(IUserInfoService userInfoService)
        {
            _userInfoService = userInfoService;
        }

        [HttpPost]
        [CheckPermission(Permissions.CreateUser)]
        public async Task<ActionResult<UserInfoDTO>> Create(CreateUserInfoDTO createUserInfo)
        {
            var result = await _userInfoService.Create(createUserInfo);
            return HandleServiceResult(result);
        }

        [HttpGet]
        [CheckPermission(Permissions.ViewUser)]
        public async Task<ActionResult> GetAll([FromQuery] PaginationParams paginationParams)
        {
            var allUsers = await _userInfoService.GetAll(paginationParams);
            return Ok(allUsers);
        }

        [HttpGet("{id:int}")]
        [CheckPermission(Permissions.ViewUser)]
        public async Task<ActionResult> GetById(int id)
        {
            var result = await _userInfoService.Get(id);
            return HandleServiceResult(result);
        }

        [HttpGet("username/{username}")]
        [CheckPermission(Permissions.ViewUser)]
        public async Task<ActionResult> GetById(string username)
        {
            var result = await _userInfoService.GetByUsername(username);
            return HandleServiceResult(result);
        }

        [HttpPut("{id}")]
        [CheckPermission(Permissions.EditUser)]
        public async Task<ActionResult> Update(int id, UpdateUserInfoDTO updateUserInfo)
        {
            var result = await _userInfoService.Update(id, updateUserInfo);
            return HandleServiceResult(result);
        }

        [HttpDelete("{id}")]
        [CheckPermission(Permissions.DeleteUser)]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _userInfoService.Delete(id);
            return HandleServiceResult(result);
        }

        [HttpPost("{id}/addToRole/{role}")]
        [CheckPermission(Permissions.EditUser)]
        public async Task<ActionResult> AddToRole(int id, string role)
        {
            var result = await _userInfoService.AddToRole(id, role);
            return HandleServiceResult(result);
        }

        [HttpDelete("{id}/removeFromRole/{role}")]
        [CheckPermission(Permissions.EditUser)]
        public async Task<ActionResult> RemoveFromRole(int id, string role)
        {
            var result = await _userInfoService.RemoveFromRole(id, role);
            return HandleServiceResult(result);
        }
    }
}
