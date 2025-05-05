using Hospital.Application.Constants;
using Hospital.Application.DTOs.Appointment;
using Hospital.Application.DTOs.AppointmentDiagnosis;
using Hospital.Application.DTOs.MedicalAssesment;
using Hospital.Application.DTOs.MedicationPrescribed;
using Hospital.Application.DTOs.SkinAnalysis;
using Hospital.Application.Interfaces;
using Hospital.Application.Models.Appointments;
using Hospital.Server.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentController : BaseApiController
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        [CheckPermission(Permissions.CreateAppointment)]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDTO model)
        {
            var result = await _appointmentService.CreateAppointment(model);
            return HandleServiceResult(result);
        }

        [HttpPut("{appointmentId}")]
        [CheckPermission(Permissions.EditAppointment)]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] CreateAppointmentDTO model)
        {
            var result = await _appointmentService.UpdateAppointment(appointmentId, model);
            return HandleServiceResult(result);
        }

        [HttpDelete("{appointmentId}")]
        [CheckPermission(Permissions.DeleteAppointment)]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            var result = await _appointmentService.DeleteAppointment(appointmentId);
            return HandleServiceResult(result);
        }

        [HttpGet("{appointmentId}")]
        [CheckPermission(Permissions.ViewDiagnosis)]
        public async Task<IActionResult> GetAppointmentById(int appointmentId)
        {
            var result = await _appointmentService.GetAppointmentById(appointmentId);
            return HandleServiceResult(result);
        }

        [HttpPost("filter")]
        [CheckPermission(Permissions.ViewAppointment)]
        public async Task<IActionResult> GetAppointmentsByFilter([FromBody] AppointmentFilter filter)
        {
            var appointments = await _appointmentService.GetAppointmentsByFilter(filter);
            return Ok(appointments);
        }

        #region Medical Assessment

        [HttpPost("{appointmentId}/assessment")]
        [CheckPermission(Permissions.CreateDiagnosis)]
        public async Task<IActionResult> AddMedicalAssessment(int appointmentId, [FromBody] CreateUpdateMedicalAssesmentDTO dto)
        {
            var result = await _appointmentService.AddMedicalAssessmentAsync(appointmentId, dto);
            return HandleServiceResult(result);
        }

        #endregion

        #region Skin Analysis

        [HttpGet("{appointmentId}/skin-analysis")]
        [CheckPermission(Permissions.ViewSkinAnalysis)]
        public async Task<IActionResult> GetSkinAnalysis(int appointmentId)
        {
            var result = await _appointmentService.GetSkinAnalysisByAppointmentId(appointmentId);
            return Ok(result);
        }

        [HttpPost("{appointmentId}/skin-analysis")]
        [CheckPermission(Permissions.CreateSkinAnalysis)]
        public async Task<IActionResult> AddSkinAnalysis(int appointmentId, [FromBody] CreateUpdateSkinAnalysisDTO dto)
        {
            var result = await _appointmentService.AddSkinAnalysisAsync(appointmentId, dto);
            return HandleServiceResult(result);
        }

        [HttpPut("{appointmentId}/skin-analysis/{analysisId}")]
        [CheckPermission(Permissions.EditSkinAnalysis)]
        public async Task<IActionResult> UpdateSkinAnalysis(int appointmentId, int analysisId, [FromBody] CreateUpdateSkinAnalysisDTO dto)
        {
            var result = await _appointmentService.UpdateSkinAnalysisAsync(appointmentId, analysisId, dto);
            return HandleServiceResult(result);
        }

        [HttpDelete("{appointmentId}/skin-analysis/{analysisId}")]
        [CheckPermission(Permissions.DeleteSkinAnalysis)]
        public async Task<IActionResult> RemoveSkinAnalysis(int appointmentId, int analysisId)
        {
            var result = await _appointmentService.RemoveSkinAnalysisAsync(appointmentId, analysisId);
            return HandleServiceResult(result);
        }

        #endregion

        #region Medication

        [HttpGet("{appointmentId}/medications")]
        [CheckPermission(Permissions.ViewMedication)]
        public async Task<IActionResult> GetMedications(int appointmentId)
        {
            var result = await _appointmentService.GetMedicationPrescribed(appointmentId);
            return Ok(result);
        }

        [HttpPost("{appointmentId}/medications")]
        [CheckPermission(Permissions.CreateMedication)]
        public async Task<IActionResult> AddMedication(int appointmentId, [FromBody] CreateUpdateMedicationPrescribedDTO dto)
        {
            var result = await _appointmentService.AddMedicationAsync(appointmentId, dto);
            return HandleServiceResult(result);
        }

        [HttpPut("{appointmentId}/medications/{medicationId}")]
        [CheckPermission(Permissions.EditMedication)]
        public async Task<IActionResult> UpdateMedication(int appointmentId, int medicationId, [FromBody] CreateUpdateMedicationPrescribedDTO dto)
        {
            var result = await _appointmentService.UpdateMedicationAsync(appointmentId, medicationId, dto);
            return HandleServiceResult(result);
        }

        [HttpDelete("{appointmentId}/medications/{medicationId}")]
        [CheckPermission(Permissions.DeleteMedication)]
        public async Task<IActionResult> RemoveMedication(int appointmentId, int medicationId)
        {
            var result = await _appointmentService.RemoveMedicationAsync(appointmentId, medicationId);
            return HandleServiceResult(result);
        }

        #endregion

        [HttpGet("/api/skin-analysis-types")]
        public async Task<IActionResult> GetSkinAnalysisTypes()
        {
            return Ok(await _appointmentService.GetSkinAnalysisTypes());
        }


        [HttpGet("{appointmentId}/diagnoses")]
        [CheckPermission(Permissions.ViewDiagnosis)]
        public async Task<IActionResult> GetAppointmentDiagnoses(int appointmentId)
        {
            var result = await _appointmentService.GetAppointmentDiagnosis(appointmentId);
            return Ok(result);
        }

        [HttpPost("{appointmentId}/diagnoses")]
        [CheckPermission(Permissions.CreateDiagnosis)]
        public async Task<IActionResult> AddAppointmentDiagnosis(int appointmentId, [FromBody] CreateUpdateAppointmentDiagnosis dto)
        {
            var result = await _appointmentService.AddAppointmentDiagnosis(appointmentId, dto);
            return HandleServiceResult(result);
        }

        [HttpPut("{appointmentId}/diagnoses/{diagnosisId}")]
        [CheckPermission(Permissions.EditDiagnosis)]
        public async Task<IActionResult> UpdateAppointmentDiagnosis(int appointmentId, int diagnosisId, [FromBody] CreateUpdateAppointmentDiagnosis dto)
        {
            var result = await _appointmentService.UpdateAppointmentDiagnosis(appointmentId, diagnosisId, dto);
            return HandleServiceResult(result);
        }

        [HttpDelete("{appointmentId}/diagnoses/{diagnosisId}")]
        [CheckPermission(Permissions.DeleteDiagnosis)]
        public async Task<IActionResult> RemoveAppointmentDiagnosis(int appointmentId, int diagnosisId)
        {
            var result = await _appointmentService.RemoveAppointmentDiagnosis(appointmentId, diagnosisId);
            return HandleServiceResult(result);
        }
    }
}
