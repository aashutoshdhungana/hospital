using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.Interfaces;
using Hospital.Domain.Models.Pagination;
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

        public async Task<bool> ExistsByEmail(string email)
        {
            return await _context.UserInfos
                .Where(x => x.Email == email)
                .AnyAsync();
        }

        public async Task<bool> ExistsByPhoneNumber(string phoneNumber)
        {
            return await _context.UserInfos
                .Where(x => x.PhoneNumber == phoneNumber)
                .AnyAsync();
        }

        public async Task<IEnumerable<UserInfo>> GetAll()
        {
            return await _context.UserInfos
                .ToListAsync();
        }

        public async Task<UserInfo?> GetById(int id)
        {
            return await _context.UserInfos
                .Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<UserInfo?> GetByPhoneNumber(string phonenumber)
        {
            return await _context.UserInfos
                .FirstOrDefaultAsync(x => x.PhoneNumber == phonenumber);
        }

        public async Task<PaginatedResult<UserInfo>> GetPaged(int pageNumber, int pageSize)
        {
            var query = _context.UserInfos
                .AsQueryable();

            var totalCount = query.Count();
            var items = await query
                .Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .OrderBy(x => x.FirstName)
                .ToListAsync();

            return new PaginatedResult<UserInfo>(items, totalCount, pageNumber, pageSize);
        }

        public void Update(UserInfo entity)
        {
            _context.UserInfos.Update(entity);
        }
    }
}
