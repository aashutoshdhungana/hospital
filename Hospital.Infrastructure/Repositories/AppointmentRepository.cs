using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Hospital.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public IUnitOfWork UnitOfWork => _context;
        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void Add(AppointmentInfo appointmentInfo)
        {
            _context.AppointmentInfos.Add(appointmentInfo);
        }

        public async Task<IEnumerable<AppointmentInfo>> GetDetailedAppointments(Expression<Func<AppointmentInfo, bool>> filterPredicate)
        {
            return await _context.AppointmentInfos.Include(x => x.DoctorInfo).ThenInclude(x => x.UserInfo)
                .Include(x => x.PatientInfo).ThenInclude(x => x.UserInfo)
                .Where(filterPredicate)
                .ToListAsync();
        }
    }
}
