using Hospital.Application.DTOs.Appointment;
using Hospital.Application.DTOs.AppointmentDiagnosis;
using Hospital.Application.DTOs.MedicalAssesment;
using Hospital.Application.DTOs.MedicationPrescribed;
using Hospital.Application.DTOs.SkinAnalysis;
using Hospital.Application.Models;
using Hospital.Application.Models.Appointments;
using Hospital.Domain.Aggregates.Appointment;

namespace Hospital.Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<ServiceResult<string>> CreateAppointment(CreateAppointmentDTO appointmentModel);
        Task<ServiceResult<string>> UpdateAppointment(int appointmenInfotId, CreateAppointmentDTO appointmentModel);
        Task<ServiceResult<string>> DeleteAppointment(int appointmentInfoId);
        Task<ServiceResult<AppointmentDTO>> GetAppointmentById(int appointmentInfoId);
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByFilter(AppointmentFilter filter);
        Task<ServiceResult<string>> AddMedicalAssessmentAsync(int appointmentId, CreateUpdateMedicalAssesmentDTO assessment);

        Task<IEnumerable<SkinAnalysisDTO>> GetSkinAnalysisByAppointmentId(int appointmentId);
        Task<ServiceResult<string>> AddSkinAnalysisAsync(int appointmentId, CreateUpdateSkinAnalysisDTO analysis);
        Task<ServiceResult<string>> RemoveSkinAnalysisAsync(int appointmentId, int analysisId);
        Task<ServiceResult<string>> UpdateSkinAnalysisAsync(int appointmentId, int analysisId, CreateUpdateSkinAnalysisDTO analysis);

        Task<IEnumerable<MedicationPrescribedDTO>> GetMedicationPrescribed(int appointmentId);
        Task<ServiceResult<string>> AddMedicationAsync(int appointmentId, CreateUpdateMedicationPrescribedDTO medication);
        Task<ServiceResult<string>> RemoveMedicationAsync(int appointmentId, int medicationId);
        Task<ServiceResult<string>> UpdateMedicationAsync(int appointmentId, int medicationId, CreateUpdateMedicationPrescribedDTO medication);
        Task<IEnumerable<SkinAnalysisType>> GetSkinAnalysisTypes();


        Task<IEnumerable<AppointmentDiagnosisDTO>> GetAppointmentDiagnosis(int appointmentId);
        Task<ServiceResult<string>> AddAppointmentDiagnosis(int appointmentId, CreateUpdateAppointmentDiagnosis appointmentDiagnosis);
        Task<ServiceResult<string>> UpdateAppointmentDiagnosis(int appointmentId, int appointmentDiagnosisId, CreateUpdateAppointmentDiagnosis appointmentDiagnosis);
        Task<ServiceResult<string>> RemoveAppointmentDiagnosis(int appointmentId, int appointmentDiagnosisId);
    }
}
