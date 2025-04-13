using Hospital.Domain.Aggregates.Rx;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Repositories
{
    public class RxRepository : IRxRepository
    {
        private readonly ApplicationDbContext _context;
        public RxRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public IUnitOfWork UnitOfWork => _context;

        public void Add(RxInfo rxInfo)
        {
            _context.RxInfos.Add(rxInfo);
        }

        public void Delete(RxInfo rxInfo)
        {
            _context.RxInfos.Remove(rxInfo);
        }

        public async Task<RxInfo?> Get(int id)
        {
            return await _context.RxInfos
                .Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<RxInfo>> GetAll()
        {
            return await _context.RxInfos
                .Include(x => x.CreatedByUser)
                .Include(x => x.UpdatedByUser)
                .ToListAsync();
        }

        public void Update(RxInfo rxInfo)
        {
            _context.RxInfos.Update(rxInfo);
        }
    }
}
