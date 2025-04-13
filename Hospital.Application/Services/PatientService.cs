using FluentValidation;
using Hospital.Application.Constants;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Doctor;
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

            var userInfo = await _userInfoRepository.GetById(createPatientDTO.UserInfoId);
            if (userInfo == null)
                return ServiceResult<PatientInfoDTO>.Failure("User profile information is not created.");

            var patientInfo = new PatientInfo(
                userInfo,
                createPatientDTO.EmergencyContactPerson,
                createPatientDTO.EmergencyContactNumber,
                _currentUserService.UserId.Value
             );

            _patientRepository.Add(patientInfo);
            var isPatientAdded = await _patientRepository.UnitOfWork.CommitAsync();
            if (!isPatientAdded)
            {
                await _patientRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<PatientInfoDTO>.Failure("Failed to add patient");
            }

            var userRoleResult = await _userIdentityService.AddUserToRole(userInfo.PhoneNumber, ApplicationRoles.Patient);
            if (!userRoleResult.IsSuccess)
            {
                await _patientRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<PatientInfoDTO>.Failure("Failed to add to role");
            }

            var isTransactionSuccess = await _patientRepository.UnitOfWork.CommitTransaction();
            if (!isTransactionSuccess)
                return ServiceResult<PatientInfoDTO>.Failure("Failed to create patient.");

            return ServiceResult<PatientInfoDTO>.Success(patientInfo.Adapt<PatientInfoDTO>());
        }

        public Task<ServiceResult<PatientInfoDTO>> UpdatePatient(int id, UpdatePatientDTO updatePatientDTO)
        {
            throw new NotImplementedException();
        }
    }
}
