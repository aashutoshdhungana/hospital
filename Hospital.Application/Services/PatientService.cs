using FluentValidation;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Patient;
using Hospital.Domain.Aggregates.UserInfo;
using Mapster;

namespace Hospital.Application.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUserInfoRepository _userInfoRepository;
        private readonly IUserIdentityService _userIdentityService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IValidator<CreatePatientDTO> _createPatientValidator;
        private readonly IValidator<UpdatePatientDTO> _updatePatientValidator;
        public PatientService(
            IPatientRepository patientRepository,
            IUserInfoRepository userInfoRepository,
            IUserIdentityService userIdentityService,
            ICurrentUserService currentUserService,
            IValidator<CreatePatientDTO> createPatientValidator
            )
        {
            _patientRepository = patientRepository;
            _userInfoRepository = userInfoRepository;
            _userIdentityService = userIdentityService;
            _currentUserService = currentUserService;
            _createPatientValidator = createPatientValidator;
        }
        public Task<ServiceResult<PatientInfoDTO>> DeletePatient(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<PatientInfoDTO>> GetPatientById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<PatientInfoDTO>> GetPatientList()
        {
            var patientList = (await _patientRepository.GetAll())
                .Adapt<IEnumerable<PatientInfoDTO>>();
            return patientList;
        }

        public async Task<ServiceResult<PatientInfoDTO>> RegisterPatient(CreatePatientDTO createPatientDTO)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<PatientInfoDTO>.Unauthorized();

            var validationResult = _createPatientValidator.Validate(createPatientDTO);
            if (!validationResult.IsValid)
                return ServiceResult<PatientInfoDTO>.FromValidationResult(validationResult);

            await _patientRepository.UnitOfWork.BeginTransaction();

            var userInfo = new UserInfo(
                createPatientDTO.Email,
                createPatientDTO.FirstName,
                createPatientDTO.MiddleName,
                createPatientDTO.LastName,
                createPatientDTO.PhoneNumber,
                createPatientDTO.Gender,
                new Address(createPatientDTO.Street, createPatientDTO.City, createPatientDTO.State, createPatientDTO.Country),
                createPatientDTO.DateOfBirth,
                _currentUserService.UserId.Value
            );

            _userInfoRepository.Add(userInfo);

            var patientInfo = new PatientInfo(
                userInfo,
                createPatientDTO.EmergencyContactPerson,
                createPatientDTO.EmergencyContactNumber,
                _currentUserService.UserId.Value
            );

            _patientRepository.Add(patientInfo);

            var isPatientInfoAdded = await _patientRepository.UnitOfWork.CommitAsync();
            if (!isPatientInfoAdded)
            {
                await _patientRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<PatientInfoDTO>.Failure("Failed to create patient.");
            }

            var userIdentityResult = await _userIdentityService.RegisterUser(userInfo, $"Patient@{patientInfo.Id}");

            if (!userIdentityResult.IsSuccess)
            {
                await _patientRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<PatientInfoDTO>.Failure("Failed to create patient.");
            }

            var isTransactionSuccess = await _patientRepository.UnitOfWork.CommitTransaction();
            if (!isTransactionSuccess)
                return ServiceResult<PatientInfoDTO>.Failure("Failed to create patient.");

            return ServiceResult<PatientInfoDTO>.Success(default!);
        }

        public Task<ServiceResult<PatientInfoDTO>> UpdatePatient(int id, UpdatePatientDTO updatePatientDTO)
        {
            throw new NotImplementedException();
        }
    }
}
