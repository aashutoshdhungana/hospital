using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Hospital.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public IUnitOfWork UnitOfWork => _context;
        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void Add(AppointmentInfo appointmentInfo)
        {
            _context.AppointmentInfos.Add(appointmentInfo);
        }
        public void Update(AppointmentInfo appointment)
        {
            _context.AppointmentInfos.Update(appointment);
        }

        public void Delete(AppointmentInfo appointment)
        {
            _context.AppointmentInfos.Remove(appointment);
        }

        public async Task<IEnumerable<AppointmentInfo>> GetDetailedAppointments(Expression<Func<AppointmentInfo, bool>> filterPredicate)
        {
            return await _context.AppointmentInfos
                .Include(x => x.DoctorInfo)
                .ThenInclude(x => x.UserInfo)
                .Include(x => x.PatientInfo).ThenInclude(x => x.UserInfo)
                .Include(x => x.MedicalAssesment)
                .Where(filterPredicate)
                .ToListAsync();
        }

        public async Task<AppointmentInfo?> GetByIdAsync(int id, string[] includes)
        {
            var query = _context.AppointmentInfos.AsQueryable();

            if (includes != null && includes.Length > 0)
            {
                foreach (string include in includes)
                {
                    if (!string.IsNullOrWhiteSpace(include))
                    {
                        query = query.Include(include);
                    }
                }
            }

            var appointment = await query.FirstOrDefaultAsync(x => x.Id == id);
            return appointment;
        }

        public async Task<MedicalAssesment?> GetAssessmentByAppointmentIdAsync(int appointmentId)
        {
            return await _context.MedicalAssesments
                .FirstOrDefaultAsync(x => x.AppointmentInfoId == appointmentId);
        }

        public async Task<IEnumerable<SkinAnalysis>> GetSkinAnalysesByAppointmentIdAsync(int appointmentId)
        {
            return await _context.SkinAnalyses.Include(x => x.SkinAnalysisType)
                .Where(x => x.AppointmentInfoId == appointmentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicationPrescibed>> GetMedicationsByAppointmentIdAsync(int appointmentId)
        {
            return await _context.MedicationPrescibed.Include(x => x.RxInfo)
                .Where(x => x.AppointmentInfoId == appointmentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<SkinAnalysisType>> GetSkinAnalysisTypes()
        {
            return await _context.SkinAnalysisTypes.ToListAsync();
        }

        public void RemoveSkinAnalysis(SkinAnalysis skinAnalysis)
        {
            _context.SkinAnalyses.Remove(skinAnalysis);
        }

        public void RemoveMedicationPrescribed(MedicationPrescibed medicationPrescibed)
        {
            _context.MedicationPrescibed.Remove(medicationPrescibed);
        }
    }
}
