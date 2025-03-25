using Hospital.Application.DTOs.Patient;
using Hospital.Application.Models;

namespace Hospital.Application.Interfaces
{
    public interface IPatientService
    {
        public Task<ServiceResult<PatientInfoDTO>> RegisterPatient(CreatePatientDTO createPatientDTO);
        public Task<ServiceResult<PatientInfoDTO>> UpdatePatient(int id, UpdatePatientDTO updatePatientDTO);
        public Task<IEnumerable<PatientInfoDTO>> GetPatientList();
        public Task<ServiceResult<PatientInfoDTO>> GetPatientById(int id);
        public Task<ServiceResult<PatientInfoDTO>> DeletePatient(int id);
    }
}
