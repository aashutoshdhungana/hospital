using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Models;

namespace Hospital.Application.Interfaces
{
    public interface IUserInfoService
    {
        Task<ServiceResult<UserInfoDTO>> Create(CreateUserInfoDTO createUserInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Update(int userId, CreateUserInfoDTO userInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Get(int id);
        Task<ServiceResult<UserInfoDTO>> Delete(int id);
        Task<ServiceResult<IEnumerable<UserInfoDTO>>> GetAll();
    }
}
