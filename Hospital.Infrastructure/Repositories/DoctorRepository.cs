using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;

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
            return await _context.DoctorInfos.FindAsync(id);
        }
    }
}
