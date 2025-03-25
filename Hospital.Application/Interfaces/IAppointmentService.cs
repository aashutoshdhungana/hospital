using Hospital.Application.DTOs.Appointment;
using Hospital.Application.Models;
using Hospital.Application.Models.Appointments;

namespace Hospital.Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<ServiceResult<string>> CreateAppointment(CreateAppointmentDTO appointmentModel);
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByFilter(AppointmentFilter filter);
    }
}
