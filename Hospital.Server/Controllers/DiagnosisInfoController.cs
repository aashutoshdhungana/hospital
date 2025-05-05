using Hospital.Application.DTOs.Diagnosis;
using Hospital.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosisInfoController : BaseApiController
    {
        private readonly IDiagnosisService _diagnosisService;

        public DiagnosisInfoController(IDiagnosisService diagnosisService)
        {
            _diagnosisService = diagnosisService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _diagnosisService.GetAllAsync();
            return HandleServiceResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _diagnosisService.GetByIdAsync(id);
            return HandleServiceResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUpdateDiagnosis diagnosis)
        {
            var result = await _diagnosisService.CreateAsync(diagnosis);
            return HandleServiceResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateDiagnosis diagnosis)
        {
            var result = await _diagnosisService.UpdateAsync(id, diagnosis);
            return HandleServiceResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _diagnosisService.DeleteAsync(id);
            return HandleServiceResult(result);
        }

        [HttpPost("{id}/prescription/{rxId}")]
        public async Task<IActionResult> AddPrescription(int id, int rxId)
        {
            var result = await _diagnosisService.AddPrescription(id, rxId);
            return HandleServiceResult(result);
        }

        [HttpDelete("{id}/prescription/{rxId}")]
        public async Task<IActionResult> RemovePrescription(int id, int rxId)
        {
            var result = await _diagnosisService.RemovePrescription(id, rxId);
            return HandleServiceResult(result);
        }
    }
}
