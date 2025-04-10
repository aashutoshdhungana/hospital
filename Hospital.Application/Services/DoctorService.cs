using FluentValidation;
using Hospital.Application.Constants;
using Hospital.Application.DTOs.Doctor;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.UserInfo;
using Mapster;

namespace Hospital.Application.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserInfoRepository _userInfoRepository;
        private readonly IUserIdentityService _userIdentityService;
        private readonly IValidator<CreateDoctorDTO> _createDoctorValidator;
        private readonly IValidator<UpdateDoctorDTO> _updateDoctorValidator;
        public DoctorService(
            IDoctorRepository doctorRepository,
            ICurrentUserService currentUserService,
            IUserInfoRepository userInfoRepository,
            IUserIdentityService userIdentityService,
            IValidator<CreateDoctorDTO> createDoctorValidator,
            IValidator<UpdateDoctorDTO> updateDoctorValidator
            )
        {
            _doctorRepository = doctorRepository;
            _currentUserService = currentUserService;
            _userIdentityService = userIdentityService;
            _createDoctorValidator = createDoctorValidator;
            _updateDoctorValidator = updateDoctorValidator;
            _userInfoRepository = userInfoRepository;
        }
        public async Task<ServiceResult<int>> CreateDoctor(int userInfoId, CreateDoctorDTO doctorModel)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<int>.Unauthorized();

            var validationResult = _createDoctorValidator.Validate(doctorModel);
            if (!validationResult.IsValid)
                return ServiceResult<int>.FromValidationResult(validationResult);

            var userInfo = await _userInfoRepository.GetById(userInfoId);
            if (userInfo == null)
                return ServiceResult<int>.Failure("Profile information is not added");

            var isDoctorCreatedForUser = (await _doctorRepository.GetByUserInfoId(userInfoId)) != null;
            if (isDoctorCreatedForUser)
                return ServiceResult<int>.Failure("User is already added as a doctor");


            await _doctorRepository.UnitOfWork.BeginTransaction();

            var doctorInfo = new DoctorInfo
            (
                userInfo,
                doctorModel.Specialization,
                _currentUserService.UserId.Value
            );

            _doctorRepository.Add(doctorInfo);

            var isDoctorInfoAdded = await _doctorRepository.UnitOfWork.CommitAsync();
            if (!isDoctorInfoAdded)
            {
                await _doctorRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<int>.Failure("Failed to add doctor");
            }

            var roleResult = await _userIdentityService.AddUserToRole(userInfo.PhoneNumber, ApplicationRoles.Admin);
            if (!roleResult.IsSuccess)
            {
                await _doctorRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<int>.Failure("Failed to add doctor");
            }

            var isTransactionSuccess = await _doctorRepository.UnitOfWork.CommitTransaction();

            if (!isTransactionSuccess)
                return ServiceResult<int>.Failure("Failed to add doctor");

            return ServiceResult<int>.Success(doctorInfo.Id);
        }
        public async Task<ServiceResult<ViewDoctorDTO>> DeleteDoctor(int id)
        {
            var doctor = await _doctorRepository.GetById(id);
            if (doctor == null)
                return ServiceResult<ViewDoctorDTO>.NotFound();

            await _doctorRepository.UnitOfWork.BeginTransaction();
            _doctorRepository.Delete(doctor);
            var isDoctorDeleted = await _doctorRepository.UnitOfWork.CommitAsync();

            if (!isDoctorDeleted)
            {
                await _doctorRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<ViewDoctorDTO>.Failure("Failed to delete doctor");
            }

            var isRemovedFromRole = await _userIdentityService.RemoveUserFromRole(doctor.UserInfo.PhoneNumber, ApplicationRoles.Admin);

            if (!isRemovedFromRole.IsSuccess)
            {
                await _doctorRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<ViewDoctorDTO>.Failure("Failed to delete doctor");
            }

            var isSuccess = await _doctorRepository.UnitOfWork.CommitTransaction();

            return isSuccess ? ServiceResult<ViewDoctorDTO>.Success(doctor.Adapt<ViewDoctorDTO>())
                : ServiceResult<ViewDoctorDTO>.Failure("Failed to delete the doctor");
        }

        public async Task<ViewDoctorDTO> GetDoctorById(int id)
        {
            var doctorInfo = await _doctorRepository.GetById(id);
            if (doctorInfo == null) return null;
            return doctorInfo.Adapt<ViewDoctorDTO>();
        }

        public async Task<IEnumerable<ViewDoctorDTO>> GetDoctors()
        {
            var doctors = await _doctorRepository.GetAll();
            return doctors.Adapt<IEnumerable<ViewDoctorDTO>>();
        }

        public async Task<ServiceResult<ViewDoctorDTO>> UpdateDoctor(int id, UpdateDoctorDTO doctorModel)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<ViewDoctorDTO>.Unauthorized();

            var validationResult = _updateDoctorValidator.Validate(doctorModel);
            if (!validationResult.IsValid)
                return ServiceResult<ViewDoctorDTO>.FromValidationResult(validationResult);

            var doctor = await _doctorRepository.GetById(id);
            if (doctor == null)
                return ServiceResult<ViewDoctorDTO>.NotFound();

            doctor.Update(
                doctorModel.MedicalLicenseNumber,
                doctorModel.PastExperienceInYears,
                doctorModel.Specialization,
                _currentUserService.UserId.Value
            );

            _doctorRepository.Update(doctor);
            var isSuccess = await _doctorRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<ViewDoctorDTO>.Success(default!) :
                ServiceResult<ViewDoctorDTO>.Failure("Failed to update doctor");
        }
    }
}
