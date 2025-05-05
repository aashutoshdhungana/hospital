using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Repositories
{
    public class DiagnosisInfoRepository : IDiagnosisInfoRepository
    {
        private readonly ApplicationDbContext _context;
        public DiagnosisInfoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public IUnitOfWork UnitOfWork => _context;
        public void Add(DiagnosisInfo entity)
        {
            _context.DiagnosisInfo.Add(entity);
        }

        public void Delete(DiagnosisInfo entity)
        {
            _context.DiagnosisInfo.Remove(entity);
        }

        public async Task<IEnumerable<DiagnosisInfo>> GetAll()
        {
            return await _context.DiagnosisInfo.Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .Include(x => x.Prescriptions)
                .ToListAsync();
        }

        public async Task<DiagnosisInfo?> GetById(int id)
        {
            return await _context.DiagnosisInfo.Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .Include(x => x.Prescriptions)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(DiagnosisInfo entity)
        {
            _context.Update(entity);
        }
    }
}
