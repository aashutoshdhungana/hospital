using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Diagnosis
{
    public interface IDiagnosisInfoRepository : IRepository<DiagnosisInfo>
    {
        void Add(DiagnosisInfo entity);
        void Update(DiagnosisInfo entity);
        void Delete(DiagnosisInfo entity);
        Task<IEnumerable<DiagnosisInfo>> GetAll();
        Task<DiagnosisInfo?> GetById(int id);
    }
}
