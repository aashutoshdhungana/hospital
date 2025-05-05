using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Aggregates.Rx;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class AppointmentInfo : AuditedEntity<int>, IAggregateRoot
    {
        private AppointmentInfo() : base() { }

        public AppointmentInfo(
            int doctorId,
            int patientId,
            DateTime appointmentDate,
            int createdBy) : base(createdBy)
        {
            DoctorInfoId = doctorId;
            PatientInfoId = patientId;
            Status = AppointmentStatus.Scheduled;
            AppointmentDate = appointmentDate;
        }

        public DateTime AppointmentDate { get; private set; }
        public int DoctorInfoId { get; private set; }
        public int PatientInfoId { get; private set; }
        public AppointmentStatus Status { get; private set; }
        public MedicalAssesment? MedicalAssesment { get; private set; }
        public IReadOnlyCollection<SkinAnalysis> SkinAnalyses => _skinAnalyses;
        private readonly List<SkinAnalysis> _skinAnalyses = new();
        public IReadOnlyCollection<MedicationPrescibed> MedicationPrescibed => _medicationPrescribed;
        private readonly List<MedicationPrescibed> _medicationPrescribed = new();

        public IReadOnlyCollection<AppointmentDiagnosis> DiagnosisInfos => _diagnosisInfos;
        private readonly List<AppointmentDiagnosis> _diagnosisInfos = new();
        public Patient.PatientInfo? PatientInfo { get; private set; }
        public Doctor.DoctorInfo? DoctorInfo { get; private set; }

        public void Update(
            int doctorId,
            int patientId,
            DateTime appointmentDate,
            int updatedBy
        )
        {
            DoctorInfoId = doctorId;
            PatientInfoId = patientId;
            AppointmentDate = appointmentDate;
            Updated(updatedBy);
        }

        public void AddSkinAnalysis(SkinAnalysis analysis)
        {
            _skinAnalyses.Add(analysis);
        }

        public void RemoveSkinAnalysis(SkinAnalysis analysis)
        {
            _skinAnalyses.Remove(analysis);
        }

        public void AddMedication(MedicationPrescibed medication)
        {
            _medicationPrescribed.Add(medication);
        }

        public void RemoveMedication(MedicationPrescibed medication)
        {
            _medicationPrescribed.Remove(medication);
        }

        public void SetMedicalAssessment(MedicalAssesment assessment)
        {
            MedicalAssesment = assessment;
        }

        public void AddAppointmentDiagnosis(AppointmentDiagnosis appointmentDiagnosis)
        {
            _diagnosisInfos.Add(appointmentDiagnosis);
            foreach (var rx in appointmentDiagnosis?.DiagnosisInfo?.Prescriptions ?? new List<RxInfo>())
            {
                if (!_medicationPrescribed.Any(x => x.RxId == rx.Id))
                {
                    _medicationPrescribed.Add(new MedicationPrescibed(
                        appointmentDiagnosis?.CreatedBy ?? 0,
                        Id,
                        rx.Id,
                        "",
                        0,
                        0,
                        DateTime.UtcNow.Date,
                        ""
                   ));
                }
            }
        }

        public void RemoveAppointmentDiagnosis(AppointmentDiagnosis appointmentDiagnosis)
        {
            _diagnosisInfos.Remove(appointmentDiagnosis);
        }

        public void Reschedule(DateTime newDate)
        {
            AppointmentDate = newDate;
            Status = AppointmentStatus.Scheduled;

        }

        public void UpdateStatus(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
