using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.UserInfo
{
    public interface IUserInfoRepository : IRepository<UserInfo>
    {
        void Add(UserInfo entity);
        void Update(UserInfo entity);
        Task<UserInfo?> GetById(int id);
        Task<IEnumerable<UserInfo>> GetAll();
        void Delete(UserInfo entity);
    }
}
