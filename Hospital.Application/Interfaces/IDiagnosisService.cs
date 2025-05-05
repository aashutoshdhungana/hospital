using Hospital.Application.DTOs.Diagnosis;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Diagnosis;

namespace Hospital.Application.Interfaces
{
    public interface IDiagnosisService
    {
        Task<ServiceResult<IEnumerable<DiagnosisViewModel>>> GetAllAsync();
        Task<ServiceResult<DiagnosisViewModel>> GetByIdAsync(int id);
        Task<ServiceResult<DiagnosisViewModel>> CreateAsync(CreateUpdateDiagnosis diagnosis);
        Task<ServiceResult<DiagnosisViewModel>> UpdateAsync(int id, CreateUpdateDiagnosis diagnosis);
        Task<ServiceResult<bool>> DeleteAsync(int id);
        Task<ServiceResult<string>> AddPrescription(int id, int rxId);
        Task<ServiceResult<string>> RemovePrescription(int id, int rxId);
    }
}
