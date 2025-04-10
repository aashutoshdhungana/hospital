using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Doctor
{
    public interface IDoctorRepository : IRepository<DoctorInfo>
    {
        Task<DoctorInfo?> GetById(int id);
        Task<DoctorInfo?> GetByUserInfoId(int userInfoId);
        Task<IEnumerable<DoctorInfo>> GetAll();
        void Add(DoctorInfo doctorInfo);
        void Update(DoctorInfo doctorInfo);
        void Delete(DoctorInfo doctorInfo);
    }
}
