using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Doctor
{
    public interface IDoctorRepository : IRepository<DoctorInfo>
    {
        Task<DoctorInfo?> GetById(int id);
    }
}
