using Hospital.Domain.Interfaces;
using System.Linq.Expressions;

namespace Hospital.Domain.Aggregates.Appointment
{
    public interface IAppointmentRepository : IRepository<AppointmentInfo>
    {
        void Add(AppointmentInfo appointmentInfo);
        Task<IEnumerable<AppointmentInfo>> GetDetailedAppointments(Expression<Func<AppointmentInfo, bool>> filterPredicate);
    }
}
