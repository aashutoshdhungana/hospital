using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;
        public IUnitOfWork UnitOfWork => _context;
        public DoctorRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<DoctorInfo?> GetById(int id)
        {
            return await _context.DoctorInfos
                .Include(x => x.UserInfo)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<DoctorInfo>> GetAll()
        {
            return await _context.DoctorInfos
                .Include(x => x.UserInfo)
                .ToListAsync();
        }

        public void Add(DoctorInfo doctorInfo)
        {
            _context.DoctorInfos.Add(doctorInfo);
        }

        public void Update(DoctorInfo doctorInfo)
        {
            _context.DoctorInfos.Update(doctorInfo);
        }

        public void Delete(DoctorInfo doctorInfo)
        {
            _context.DoctorInfos.Remove(doctorInfo);
        }

        public async Task<DoctorInfo?> GetByUserInfoId(int userInfoId)
        {
            return await _context.DoctorInfos.FirstOrDefaultAsync(x => x.UserInfoId == userInfoId);
        }
    }
}
