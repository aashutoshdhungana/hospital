using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Models;

namespace Hospital.Application.Interfaces
{
    public interface IUserInfoService
    {
        Task<ServiceResult<UserInfoDTO>> Create(CreateUpdateUserInfoDTO createUserInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Update(int userId, CreateUpdateUserInfoDTO userInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Get(int id);
        Task<ServiceResult<UserInfoDTO>> Delete(int id);
        Task<ServiceResult<IEnumerable<UserInfoDTO>>> GetAll();
    }
}
