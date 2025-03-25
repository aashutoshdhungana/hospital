using Hospital.Domain.Interfaces;
using System.Linq.Expressions;

namespace Hospital.Domain.Aggregates.Patient;

public interface IPatientRepository : IRepository<PatientInfo>
{
    void Add(PatientInfo entity);
    void Update(PatientInfo entity);
    Task<PatientInfo?> GetDetailedPatientById(int id);
    Task<IEnumerable<PatientInfo>> GetDetailedPatients(Expression<Func<PatientInfo, bool>> filterPredicate);
    Task<PatientInfo?> GetById(int id);
    Task<IEnumerable<PatientInfo>> GetAll();
    void Delete(PatientInfo patientInfo);
}
