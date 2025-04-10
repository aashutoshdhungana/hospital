using Hospital.Application.Constants;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.Interfaces;
using Hospital.Server.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : BaseApiController
    {
        private readonly IPatientService _patientService;
        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }
        
        [HttpPost]
        [CheckPermission(Permissions.CreatePatient)]
        public async Task<IActionResult> CreatePatient(CreatePatientDTO patientInfo)
        {
            var result = await _patientService.RegisterPatient(patientInfo);
            return HandleServiceResult(result);
        }

        [HttpGet]
        [CheckPermission(Permissions.ViewPatient)]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _patientService.GetPatientList());
        }
    }
}
