using Hospital.Application.Constants;
using Hospital.Application.DTOs.Doctor;
using Hospital.Application.Interfaces;
using Hospital.Server.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : BaseApiController
    {
        private readonly IDoctorService _doctorService;
        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet]
        [CheckPermission(Permissions.ViewDoctor)]
        public async Task<ActionResult<IEnumerable<ViewDoctorDTO>>> GetAll()
        {
            var doctors = await _doctorService.GetDoctors();
            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ViewDoctorDTO>> GetById(int id)
        {
            var doctor = await _doctorService.GetDoctorById(id);
            if (doctor == null)
                return NotFound();
            return Ok(doctor);
        }

        [HttpPost]
        [CheckPermission(Permissions.CreateDoctor)]
        public async Task<ActionResult<int>> Create(int userInfoId, CreateDoctorDTO doctorDTO)
        {
            var result = await _doctorService.CreateDoctor(userInfoId, doctorDTO);
            return HandleServiceResult(result);
        }

        [HttpPut("{id}")]
        [CheckPermission(Permissions.EditDoctor)]
        public async Task<ActionResult> Update(int id, UpdateDoctorDTO doctorDTO)
        {
            var result = await _doctorService.UpdateDoctor(id, doctorDTO);
            return HandleServiceResult(result);
        }

    }
}
