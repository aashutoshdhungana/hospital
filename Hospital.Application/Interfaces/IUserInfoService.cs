using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Models;
using Hospital.Domain.Models.Pagination;

namespace Hospital.Application.Interfaces
{
    public interface IUserInfoService
    {
        Task<ServiceResult<UserInfoDTO>> Create(CreateUserInfoDTO createUserInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Update(int id, UpdateUserInfoDTO userInfoDTO);
        Task<ServiceResult<UserInfoDTO>> Get(int id);
        Task<ServiceResult<UserInfoDTO>> Delete(int id);
        Task<PaginatedResult<UserInfoDTO>> GetAll(PaginationParams paginationParams);
        Task<ServiceResult<UserInfoDTO>> GetByUsername(string username);
    }
}
