using FluentValidation;
using Hospital.Application.DTOs.Appointment;
using Hospital.Application.DTOs.AppointmentDiagnosis;
using Hospital.Application.DTOs.MedicalAssesment;
using Hospital.Application.DTOs.MedicationPrescribed;
using Hospital.Application.DTOs.SkinAnalysis;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Application.Models.Appointments;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Patient;
using Mapster;

namespace Hospital.Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IValidator<CreateAppointmentDTO> _validator;
        private readonly ICurrentUserService _currentUserService;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDiagnosisInfoRepository _diagnosisInfoRepository;
        public AppointmentService(
            IAppointmentRepository appointmentRepository,
            ICurrentUserService currentUserService,
            IValidator<CreateAppointmentDTO> validator,
            IDoctorRepository doctorRepository,
            IPatientRepository patientRepository,
            IDiagnosisInfoRepository diagnosisInfoRepository
        )
        {
            _validator = validator;
            _currentUserService = currentUserService;
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
            _diagnosisInfoRepository = diagnosisInfoRepository;
        }

        public async Task<ServiceResult<string>> AddMedicalAssessmentAsync(int appointmentId, CreateUpdateMedicalAssesmentDTO assessment)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["MedicalAssesment"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            if (appointmentInfo.MedicalAssesment != null)
            {
                appointmentInfo.MedicalAssesment.Update(
                    assessment.ChiefComplaint,
                    assessment.HistoryOfIllness,
                    assessment.Advice,
                    _currentUserService.UserId.Value
                );
            }
            else
            {
                appointmentInfo.SetMedicalAssessment(new MedicalAssesment(
                    appointmentInfo.Id,
                    assessment.ChiefComplaint,
                    assessment.HistoryOfIllness,
                    assessment.Advice,
                    _currentUserService.UserId.Value
                ));
            }
            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Medical assesment added successfully")
                : ServiceResult<string>.Failure("Failed to update medical assesment");
        }

        public async Task<ServiceResult<string>> AddMedicationAsync(int appointmentId, CreateUpdateMedicationPrescribedDTO medication)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["MedicationPrescibed"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            appointmentInfo.AddMedication(new MedicationPrescibed(
                _currentUserService.UserId.Value,
                appointmentInfo.Id,
                medication.RxId,
                medication.ApplicationType,
                medication.TimesPerDay,
                medication.DurationInDays,
                medication.StartDate,
                medication.Remarks
            ));

            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully added medication")
                : ServiceResult<string>.Failure("Failed to add medication");
        }

        public async Task<ServiceResult<string>> UpdateMedicationAsync(int appointmentId, int medicationId, CreateUpdateMedicationPrescribedDTO medication)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["MedicationPrescibed"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            var dbMedication = appointmentInfo.MedicationPrescibed.FirstOrDefault(x => x.Id == medicationId);
            if (dbMedication == null)
                return ServiceResult<string>.NotFound();

            dbMedication.Update(
                _currentUserService.UserId.Value,
                medication.RxId,
                medication.ApplicationType,
                medication.TimesPerDay,
                medication.DurationInDays,
                medication.StartDate,
                medication.Remarks
            );

            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully updated medication")
                : ServiceResult<string>.Failure("Failed to update medication");

        }

        public async Task<ServiceResult<string>> RemoveMedicationAsync(int appointmentId, int medicationId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["MedicationPrescibed"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            var medication = appointmentInfo.MedicationPrescibed.FirstOrDefault(x => x.Id == medicationId);
            if (medication == null)
                return ServiceResult<string>.NotFound();

            _appointmentRepository.RemoveMedicationPrescribed(medication);
            _appointmentRepository.Update(appointmentInfo);
            appointmentInfo.RemoveMedication(medication);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();

            return isSuccess ? ServiceResult<string>.Success("Successfully removed the medication")
                : ServiceResult<string>.Failure("Failed to remove the medication");
        }

        public async Task<ServiceResult<string>> AddSkinAnalysisAsync(int appointmentId, CreateUpdateSkinAnalysisDTO analysis)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["SkinAnalyses"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            appointmentInfo.AddSkinAnalysis(new SkinAnalysis(
                analysis.SkinAnalysisTypeId,
                appointmentInfo.Id,
                analysis.Analysis,
                analysis.IsAbnormal,
                _currentUserService.UserId.Value
            ));

            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully added skin analysis")
                : ServiceResult<string>.Failure("Failed to add skin analysis");
        }

        public async Task<ServiceResult<string>> UpdateSkinAnalysisAsync(int appointmentId, int analysisId, CreateUpdateSkinAnalysisDTO analysis)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["SkinAnalyses"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            var dbAnalysis = appointmentInfo.SkinAnalyses.FirstOrDefault(x => x.Id == analysisId);
            if (dbAnalysis == null)
                return ServiceResult<string>.NotFound();

            dbAnalysis.Update(
                analysis.SkinAnalysisTypeId,
                analysis.Analysis,
                analysis.IsAbnormal,
                _currentUserService.UserId.Value
            );

            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully updated skin analysis")
                : ServiceResult<string>.Failure("Failed to update skin analysis");
        }

        public async Task<ServiceResult<string>> RemoveSkinAnalysisAsync(int appointmentId, int analysisId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentId, ["SkinAnalyses"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            var analysis = appointmentInfo.SkinAnalyses.FirstOrDefault(x => x.Id == analysisId);
            if (analysis == null)
                return ServiceResult<string>.NotFound();

            _appointmentRepository.RemoveSkinAnalysis(analysis);
            appointmentInfo.RemoveSkinAnalysis(analysis);
            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully removed skin analysis")
                : ServiceResult<string>.Failure("Failed to remove skin analysis");
        }

        public async Task<ServiceResult<string>> CreateAppointment(CreateAppointmentDTO appointmentModel)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var validationResult = _validator.Validate(appointmentModel);
            if (!validationResult.IsValid)
            {
                return ServiceResult<string>.FromValidationResult(validationResult);
            }

            var doctor = await _doctorRepository.GetById(appointmentModel.DoctorInfoId);
            if (doctor == null)
                return ServiceResult<string>.Failure("Doctor not found.");

            var patient = await _patientRepository.GetById(appointmentModel.PatientInfoId);
            if (patient == null)
                return ServiceResult<string>.Failure("Patient not found.");

            var appointment = new AppointmentInfo(
                doctor.Id,
                patient.Id,
                appointmentModel.AppointmentDate,
                _currentUserService.UserId.Value
            );

            _appointmentRepository.Add(appointment);

            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Created appointment successfully") :
                ServiceResult<string>.Failure("Failed to create appointment");
        }

        public async Task<ServiceResult<string>> DeleteAppointment(int appointmentInfoId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentInfoId, ["MedicationPrescibed", "SkinAnalyses", "MedicalAssesment"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            if (appointmentInfo.Status == AppointmentStatus.Completed) 
            {
                return ServiceResult<string>.Failure("Completed appointment cannot be deleted");
            }

            if (appointmentInfo.SkinAnalyses.Any() || appointmentInfo.MedicationPrescibed.Any() || appointmentInfo.MedicalAssesment != null) 
            {
                return ServiceResult<string>.Failure("Appointment cannot be deleted as it contains related data");
            }

            _appointmentRepository.Delete(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();

            return isSuccess ? ServiceResult<string>.Success("Deleted appointment successfully")
                : ServiceResult<string>.Failure("Failed to delete appointment");
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByFilter(AppointmentFilter filter)
        {
            return (await _appointmentRepository.GetDetailedAppointments(x => (!filter.PatientId.HasValue || filter.PatientId.Value == x.PatientInfoId) &&
                (!filter.DoctorId.HasValue || filter.DoctorId.Value == x.DoctorInfoId) &&
                ((filter.From ?? DateTime.UtcNow).Date <= x.AppointmentDate.Date) &&
                ((filter.To ?? DateTime.UtcNow).Date >= x.AppointmentDate.Date)
            )).Adapt<IEnumerable<AppointmentDTO>>();
        }

        public async Task<ServiceResult<string>> UpdateAppointment(int appointmentInfoId, CreateAppointmentDTO appointmentModel)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointmentInfo = await _appointmentRepository.GetByIdAsync(appointmentInfoId, ["MedicationPrescibed", "SkinAnalyses", "MedicalAssesment"]);
            if (appointmentInfo == null)
                return ServiceResult<string>.NotFound();

            if (appointmentInfo.Status == AppointmentStatus.Completed)
            {
                return ServiceResult<string>.Failure("Completed appointment cannot be updated");
            }

            if (appointmentInfo.SkinAnalyses.Any() || appointmentInfo.MedicationPrescibed.Any() || appointmentInfo.MedicalAssesment != null || appointmentInfo.DiagnosisInfos.Any())
            {
                return ServiceResult<string>.Failure("Appointment cannot be updated as it contains related data");
            }

            appointmentInfo.Update(appointmentModel.DoctorInfoId,
                appointmentModel.PatientInfoId,
                appointmentModel.AppointmentDate,
                _currentUserService.UserId.Value
            );

            _appointmentRepository.Update(appointmentInfo);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();

            return isSuccess ? ServiceResult<string>.Success("Updated appointment successfully")
                : ServiceResult<string>.Failure("Failed to update appointment");
        }

        public async Task<IEnumerable<SkinAnalysisDTO>> GetSkinAnalysisByAppointmentId(int appointmentId)
        {
            var skinAnalysis = await _appointmentRepository.GetSkinAnalysesByAppointmentIdAsync(appointmentId);
            return skinAnalysis.Adapt<IEnumerable<SkinAnalysisDTO>>();
        }

        public async Task<IEnumerable<MedicationPrescribedDTO>> GetMedicationPrescribed(int appointmentId)
        {
            var medicationPrescribed = await _appointmentRepository.GetMedicationsByAppointmentIdAsync(appointmentId);
            return medicationPrescribed.Adapt<IEnumerable<MedicationPrescribedDTO>>();
        }

        public async Task<ServiceResult<AppointmentDTO>> GetAppointmentById(int appointmentInfoId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentInfoId, ["MedicalAssesment", "DoctorInfo.UserInfo", "PatientInfo.UserInfo"]);
            if (appointment == null)
                return ServiceResult<AppointmentDTO>.NotFound();

            var appointmentDto = appointment.Adapt<AppointmentDTO>();
            return ServiceResult<AppointmentDTO>.Success(appointmentDto);
        }

        public async Task<IEnumerable<SkinAnalysisType>> GetSkinAnalysisTypes()
        {
            return await _appointmentRepository.GetSkinAnalysisTypes();
        }

        public async Task<IEnumerable<AppointmentDiagnosisDTO>> GetAppointmentDiagnosis(int appointmentId)
        {
            return (await _appointmentRepository.GetDiagnosisInfosByAppointmentId(appointmentId))
                .Adapt<IEnumerable<AppointmentDiagnosisDTO>>();
        }

        public async Task<ServiceResult<string>> AddAppointmentDiagnosis(int appointmentId, CreateUpdateAppointmentDiagnosis appointmentDiagnosis)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId, ["DiagnosisInfos", "MedicationPrescibed"]);
            if (appointment == null)
                return ServiceResult<string>.NotFound();

            var existingDiagnosis = appointment.DiagnosisInfos.FirstOrDefault(x => x.DiagnosisInfoId == appointmentDiagnosis.DiagnosisInfoId);
            if (existingDiagnosis != null)
            {
                return ServiceResult<string>.Failure("Diagnosis already added");
            }

            var diagnosis = await _diagnosisInfoRepository.GetById(appointmentDiagnosis.DiagnosisInfoId);
            if (diagnosis == null)
                return ServiceResult<string>.NotFound();

            var dbEntity = new AppointmentDiagnosis(appointmentId, appointmentDiagnosis.DiagnosisInfoId, appointmentDiagnosis.Remarks, _currentUserService.UserId.Value);
            dbEntity.DiagnosisInfo = diagnosis;
            appointment.AddAppointmentDiagnosis(dbEntity);
            _appointmentRepository.Update(appointment);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Appointment daignosis added successfully") :
                ServiceResult<string>.Failure("Failed to add appointment diagnosis");
        }

        public async Task<ServiceResult<string>> UpdateAppointmentDiagnosis(int appointmentId, int appointmentDiagnosisId, CreateUpdateAppointmentDiagnosis appointmentDiagnosis)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId, ["DiagnosisInfos", "MedicationPrescibed"]);
            if (appointment == null)
                return ServiceResult<string>.NotFound();

            var existingDiagnosis = appointment.DiagnosisInfos
                .FirstOrDefault(d => d.Id == appointmentDiagnosisId);

            if (existingDiagnosis == null)
                return ServiceResult<string>.NotFound();

            var diagnosis = await _diagnosisInfoRepository.GetById(appointmentDiagnosis.DiagnosisInfoId);
            if (diagnosis == null)
                return ServiceResult<string>.NotFound();

            if (appointment.DiagnosisInfos.Any(x => x.DiagnosisInfoId == appointmentDiagnosis.DiagnosisInfoId && x.Id != appointmentDiagnosisId))
            {
                return ServiceResult<string>.Failure("Daignosis already added");
            }

            existingDiagnosis.Update(appointmentDiagnosis.DiagnosisInfoId, appointmentDiagnosis.Remarks, _currentUserService.UserId.Value);
            foreach (var rx in diagnosis.Prescriptions)
            {
                if (!appointment.MedicationPrescibed.Any(x => x.RxId == rx.Id))
                {
                    appointment.AddMedication(new MedicationPrescibed(
                        _currentUserService.UserId.Value,
                        appointment.Id,
                        rx.Id,
                        "",
                        0,
                        0,
                        DateTime.UtcNow.Date,
                        ""
                    ));
                }
            }
            _appointmentRepository.Update(appointment);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess
                ? ServiceResult<string>.Success("Appointment diagnosis updated successfully")
                : ServiceResult<string>.Failure("Failed to update appointment diagnosis");
        }


        public async Task<ServiceResult<string>> RemoveAppointmentDiagnosis(int appointmentId, int appointmentDiagnosisId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId, ["DiagnosisInfos", "MedicationPrescibed"]);
            if (appointment == null)
                return ServiceResult<string>.NotFound();

            var existingDiagnosis = appointment.DiagnosisInfos
                .FirstOrDefault(d => d.Id == appointmentDiagnosisId);

            if (existingDiagnosis == null)
                return ServiceResult<string>.NotFound();

            appointment.RemoveAppointmentDiagnosis(existingDiagnosis);
            _appointmentRepository.Update(appointment);
            var isSuccess = await _appointmentRepository.UnitOfWork.CommitAsync();
            return isSuccess
                ? ServiceResult<string>.Success("Appointment diagnosis removed successfully")
                : ServiceResult<string>.Failure("Failed to remove appointment diagnosis");
        }
    }
}
