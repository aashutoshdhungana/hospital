using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Repositories
{
    public class UserInfoRepository : IUserInfoRepository
    {
        private readonly ApplicationDbContext _context;
        public UserInfoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public IUnitOfWork UnitOfWork => _context;

        public void Add(UserInfo entity)
        {
            _context.Add(entity);
        }

        public void Delete(UserInfo entity)
        {
            _context.Remove(entity);
        }

        public async Task<IEnumerable<UserInfo>> GetAll()
        {
            return await _context.UserInfos
                .ToListAsync();
        }

        public async Task<UserInfo?> GetById(int id)
        {
            return await _context.UserInfos.FindAsync(id);
        }

        public async Task<UserInfo?> GetByPhoneNumber(string phonenumber)
        {
            return await _context.UserInfos
                .FirstOrDefaultAsync(x => x.PhoneNumber == phonenumber);
        }

        public void Update(UserInfo entity)
        {
            _context.UserInfos.Update(entity);
        }
    }
}
