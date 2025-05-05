using FluentValidation;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.Models.Pagination;
using Mapster;

namespace Hospital.Application.Services
{
    public class UserInfoService : IUserInfoService
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserInfoRepository _userInfoRepository;
        private readonly IUserIdentityService _userIdentityService;
        private readonly IValidator<CreateUserInfoDTO> _validator;
        public UserInfoService(
            ICurrentUserService currentUserService,
            IUserInfoRepository userInfoRepository,
            IUserIdentityService userIdentityService,
            IValidator<CreateUserInfoDTO> validator
            )
        {
            _currentUserService = currentUserService;
            _userInfoRepository = userInfoRepository;
            _userIdentityService = userIdentityService;
            _validator = validator;
        }

        public async Task<ServiceResult<string>> AddToRole(int userId, string role)
        {
            var userInfo = await _userInfoRepository.GetById(userId);
            if (userInfo == null)
                return ServiceResult<string>.NotFound();
            return await _userIdentityService.AddUserToRole(userInfo.PhoneNumber, role);
        }

        public async Task<ServiceResult<UserInfoDTO>> Create(CreateUserInfoDTO createUserInfoDTO)
        {
            var validationResult = await _validator.ValidateAsync(createUserInfoDTO);
            if (!validationResult.IsValid)
                return ServiceResult<UserInfoDTO>.FromValidationResult(validationResult);

            if ((_currentUserService.UserId ?? 0) <= 0)
                return ServiceResult<UserInfoDTO>.Unauthorized();

            await _userInfoRepository.UnitOfWork.BeginTransaction();

            var userInfo = new UserInfo(
                createUserInfoDTO.Email,
                createUserInfoDTO.FirstName,
                createUserInfoDTO.MiddleName,
                createUserInfoDTO.LastName,
                createUserInfoDTO.PhoneNumber,
                createUserInfoDTO.Gender,
                new Address(createUserInfoDTO.Street, createUserInfoDTO.City, createUserInfoDTO.State, createUserInfoDTO.Country),
                createUserInfoDTO.DateOfBirth,
                _currentUserService.UserId.Value
                );

            _userInfoRepository.Add(userInfo);

            var isUserInfoCreated = await _userInfoRepository.UnitOfWork.CommitAsync();
            if (!isUserInfoCreated) {
                await _userInfoRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<UserInfoDTO>.Failure("Failed to create user account");
            }
            var identityResult = await _userIdentityService.RegisterUser(userInfo, $"P@aasword123");
            if (!identityResult.IsSuccess)
            {
                await _userInfoRepository.UnitOfWork.RollbackTransaction();
                return ServiceResult<UserInfoDTO>.Failure("Failed to create user account");
            }

            var isSuccess = await _userInfoRepository.UnitOfWork.CommitTransaction();

            return isSuccess ? ServiceResult<UserInfoDTO>.Created(userInfo.Adapt<UserInfoDTO>())
                : ServiceResult<UserInfoDTO>.Failure("Failed to add user info.");
        }

        public async Task<ServiceResult<UserInfoDTO>> Delete(int id)
        {
            if ((_currentUserService.UserId ?? 0) <= 0)
                return ServiceResult<UserInfoDTO>.Unauthorized();

            var userInfo = await _userInfoRepository.GetById(id);
            if (userInfo == null)
                return ServiceResult<UserInfoDTO>.NotFound();

            _userInfoRepository.Delete(userInfo);
            var isSuccess = await _userInfoRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<UserInfoDTO>.Success(default!)
                : ServiceResult<UserInfoDTO>.Failure("Failed to delete user info.");
        }

        public async Task<ServiceResult<UserInfoDTO>> Get(int id)
        {
            var userInfo = await _userInfoRepository.GetById(id);
            if (userInfo == null)
                return ServiceResult<UserInfoDTO>.NotFound();

            return ServiceResult<UserInfoDTO>
                .Success(userInfo.Adapt<UserInfoDTO>());
        }

        public async Task<PaginatedResult<UserInfoDTO>> GetAll(PaginationParams paginationParams)
        {
            paginationParams.Validate();
            var result = await _userInfoRepository.GetPaged(paginationParams.PageNumber, paginationParams.PageSize);
            return result.Adapt<PaginatedResult<UserInfoDTO>>();
        }

        public async Task<ServiceResult<UserInfoDTO>> GetByUsername(string username)
        {
            var userInfo = await _userInfoRepository.GetByPhoneNumber(username);
            if (userInfo == null)
                return ServiceResult<UserInfoDTO>.NotFound();
            return ServiceResult<UserInfoDTO>.Success(userInfo.Adapt<UserInfoDTO>());
        }

        public async Task<ServiceResult<string>> RemoveFromRole(int userId, string role)
        {
            var userInfo = await _userInfoRepository.GetById(userId);
            if (userInfo == null)
                return ServiceResult<string>.NotFound();
            return await _userIdentityService.RemoveUserFromRole(userInfo.PhoneNumber, role);
        }

        public async Task<ServiceResult<UserInfoDTO>> Update(int userId, UpdateUserInfoDTO userInfoDTO)
        {
            if ((_currentUserService.UserId ?? 0) <= 0)
                return ServiceResult<UserInfoDTO>.Unauthorized();

            var userInfo = await _userInfoRepository.GetById(userId);
            if (userInfo == null)
                return ServiceResult<UserInfoDTO>.NotFound();

            userInfo.Update(
                userInfoDTO.Email,
                userInfoDTO.FirstName,
                userInfoDTO.MiddleName,
                userInfoDTO.LastName,
                userInfoDTO.Gender,
                new Address(userInfoDTO.Street, userInfoDTO.City, userInfoDTO.State, userInfoDTO.Country),
                userInfoDTO.DateOfBirth,
                _currentUserService.UserId.Value
                );

            _userInfoRepository.Update(userInfo);
            var isSuccess = await _userInfoRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<UserInfoDTO>.Success(userInfo.Adapt<UserInfoDTO>()) :
                ServiceResult<UserInfoDTO>.Failure("Failed to update user info.");
        }
    }
}
