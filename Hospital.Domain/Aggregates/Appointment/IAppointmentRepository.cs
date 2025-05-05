using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Interfaces;
using System.Linq.Expressions;

namespace Hospital.Domain.Aggregates.Appointment
{
    public interface IAppointmentRepository : IRepository<AppointmentInfo>
    {
        void Add(AppointmentInfo appointmentInfo);
        void Update(AppointmentInfo appointment);
        void Delete(AppointmentInfo appointment);


        Task<IEnumerable<AppointmentInfo>> GetDetailedAppointments(Expression<Func<AppointmentInfo, bool>> filterPredicate);
        Task<AppointmentInfo?> GetByIdAsync(int id, string[] includes);

        Task<MedicalAssesment?> GetAssessmentByAppointmentIdAsync(int appointmentId);
        Task<IEnumerable<AppointmentDiagnosis>> GetDiagnosisInfosByAppointmentId(int appointmentId);
        Task<IEnumerable<SkinAnalysis>> GetSkinAnalysesByAppointmentIdAsync(int appointmentId);
        Task<IEnumerable<MedicationPrescibed>> GetMedicationsByAppointmentIdAsync(int appointmentId);
        Task<IEnumerable<SkinAnalysisType>> GetSkinAnalysisTypes();
        void RemoveSkinAnalysis(SkinAnalysis skinAnalysis);
        void RemoveMedicationPrescribed(MedicationPrescibed medicationPrescibed);

    }
}
