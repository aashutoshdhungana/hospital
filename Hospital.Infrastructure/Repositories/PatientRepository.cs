using Hospital.Domain.Aggregates.Patient;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Hospital.Infrastructure.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;
        public IUnitOfWork UnitOfWork => _context;
        public PatientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Add(PatientInfo entity)
        {
            _context.Add(entity);
        }

        public async Task<IEnumerable<PatientInfo>> GetAll()
        {
            var patients = await _context.PatientInfos.Include(x => x.UserInfo)
                 .ToListAsync();
            return patients;
        }

        public async Task<PatientInfo?> GetById(int id)
        {
            return await _context.PatientInfos.Include(x => x.UserInfo)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(PatientInfo entity)
        {
            if (entity.Id <= 0)
                throw new InvalidDataException(nameof(entity));
            _context.PatientInfos.Update(entity);
        }

        public void Delete(PatientInfo entity)
        {
            if (entity.Id <= 0)
                throw new InvalidDataException(nameof(entity));
            _context.PatientInfos.Remove(entity);
        }

        public async Task<PatientInfo?> GetDetailedPatientById(int id)
        {
            return await _context.PatientInfos.Include(x => x.UserInfo)
                .Include(x => x.Appointments).ThenInclude(x => x.DoctorInfo)
                .FirstOrDefaultAsync(x => x.PatientId == id);
        }

        public async Task<IEnumerable<PatientInfo>> GetDetailedPatients(Expression<Func<PatientInfo, bool>> filterPredicate)
        {
            return await _context.PatientInfos.Include(x => x.UserInfo)
                .Include(x => x.Appointments).ThenInclude(x => x.DoctorInfo)
                .Where(filterPredicate)
                .ToListAsync();
        }
    }
}
