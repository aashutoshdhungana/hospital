using FluentValidation;
using Hospital.Application.DTOs.Appointment;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Application.Models.Appointments;
using Hospital.Domain.Aggregates.Appointment;
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
        public AppointmentService(
            IAppointmentRepository appointmentRepository,
            ICurrentUserService currentUserService,
            IValidator<CreateAppointmentDTO> validator,
            IDoctorRepository doctorRepository,
            IPatientRepository patientRepository
        )
        {
            _validator = validator;
            _currentUserService = currentUserService;
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
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

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByFilter(AppointmentFilter filter)
        {
            return (await _appointmentRepository.GetDetailedAppointments(x => (!filter.PatientId.HasValue || filter.PatientId.Value == x.PatientInfoId) &&
                (!filter.DoctorId.HasValue || filter.DoctorId.Value == x.DoctorInfoId) &&
                ((filter.From ?? DateTime.UtcNow).Date <= x.AppointmentDate.Date) &&
                ((filter.To ?? DateTime.UtcNow).Date >= x.AppointmentDate.Date)
            )).Adapt<IEnumerable<AppointmentDTO>>();
        }
    }
}
