using Hospital.Domain.Interfaces;
using Hospital.Domain.Models.Pagination;

namespace Hospital.Domain.Aggregates.UserInfo
{
    public interface IUserInfoRepository : IRepository<UserInfo>
    {
        void Add(UserInfo entity);
        void Update(UserInfo entity);
        Task<UserInfo?> GetById(int id);
        Task<IEnumerable<UserInfo>> GetAll();
        Task<PaginatedResult<UserInfo>> GetPaged(int pageNumber, int pageSize);
        void Delete(UserInfo entity);
        Task<bool> ExistsByEmail(string email);
        Task<bool> ExistsByPhoneNumber(string phoneNumber);
    }
}
