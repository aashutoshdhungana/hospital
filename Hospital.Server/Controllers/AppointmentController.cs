using Hospital.Application.DTOs.Appointment;
using Hospital.Application.Interfaces;
using Hospital.Application.Models.Appointments;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : BaseApiController
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateAppointmentDTO createAppointment)
        {
            var result = await _appointmentService.CreateAppointment(createAppointment);
            return HandleServiceResult(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetByAppointmentsByFilter([FromQuery]AppointmentFilter filter)
        {
            var result = await _appointmentService.GetAppointmentsByFilter(filter);
            return Ok(result);
        }
    }
}
