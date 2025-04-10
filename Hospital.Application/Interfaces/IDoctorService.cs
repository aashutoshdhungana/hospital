using Hospital.Application.DTOs.Doctor;
using Hospital.Application.Models;

namespace Hospital.Application.Interfaces
{
    public interface IDoctorService
    {
        Task<ServiceResult<int>> CreateDoctor(int userInfoId, CreateDoctorDTO doctorModel);
        Task<IEnumerable<ViewDoctorDTO>> GetDoctors();
        Task<ViewDoctorDTO> GetDoctorById(int id);
        Task<ServiceResult<ViewDoctorDTO>> UpdateDoctor(int id, UpdateDoctorDTO doctorModel);
        Task<ServiceResult<ViewDoctorDTO>> DeleteDoctor(int id);
    }
}
