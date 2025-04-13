using FluentValidation;
using Hospital.Application.DTOs.RxInfo;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Rx;
using Mapster;

namespace Hospital.Application.Services
{
    public class RxInfoService : IRxInfoService
    {
        private readonly IRxRepository _rxRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IValidator<CreateUpdateRxInfoDTO> _validator;
        public RxInfoService(
            IRxRepository rxRepository, 
            ICurrentUserService currentUserService,
            IValidator<CreateUpdateRxInfoDTO> validator
            )
        {
            _rxRepository = rxRepository;
            _currentUserService = currentUserService;
            _validator = validator;
        }

        public async Task<ServiceResult<RxInfoDTO>> Create(CreateUpdateRxInfoDTO rxDTO)
        {
            var validationResult = _validator.Validate(rxDTO);
            if (!validationResult.IsValid)
                return ServiceResult<RxInfoDTO>.FromValidationResult(validationResult);

            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<RxInfoDTO>.Unauthorized();

            var rxInfo = new RxInfo(
                rxDTO.Name,
                rxDTO.Type,
                rxDTO.Remarks,
                _currentUserService.UserId.Value
                );

            _rxRepository.Add(rxInfo);

            var isSuccess = await _rxRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<RxInfoDTO>.Success(default!)
                : ServiceResult<RxInfoDTO>.Failure("Failed to create the Rx");
        }

        public async Task<ServiceResult<RxInfoDTO>> Delete(int id)
        {
            var rxInfo = await _rxRepository.Get(id);
            if (rxInfo == null)
                return ServiceResult<RxInfoDTO>.NotFound();

            _rxRepository.Delete(rxInfo);
            var isSuccess = await _rxRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<RxInfoDTO>.Success(default!)
                : ServiceResult<RxInfoDTO>.Failure("Failed to delete the Rx");
        }

        public async Task<IEnumerable<RxInfoDTO>> GetAllRx()
        {
            var rxList = await _rxRepository.GetAll();
            return rxList.Adapt<IEnumerable<RxInfoDTO>>();
        }

        public async Task<ServiceResult<RxInfoDTO>> GetRxById(int id)
        {
            var rxInfo = await _rxRepository.Get(id);
            if (rxInfo == null)
                return ServiceResult<RxInfoDTO>.NotFound();

            return ServiceResult<RxInfoDTO>.Success(rxInfo.Adapt<RxInfoDTO>());
        }

        public async Task<ServiceResult<RxInfoDTO>> Update(int id, CreateUpdateRxInfoDTO rxDTO)
        {
            var validationResult = _validator.Validate(rxDTO);
            if (!validationResult.IsValid)
                return ServiceResult<RxInfoDTO>.FromValidationResult(validationResult);

            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<RxInfoDTO>.Unauthorized();

            var rxInfo = await _rxRepository.Get(id);
            if (rxInfo == null)
                return ServiceResult<RxInfoDTO>.NotFound();

            rxInfo.Update(
                rxDTO.Name,
                rxDTO.Type,
                rxDTO.Remarks,
                _currentUserService.UserId.Value
            );

            _rxRepository.Update(rxInfo);
            var isSuccess = await _rxRepository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<RxInfoDTO>.Success(default!)
                : ServiceResult<RxInfoDTO>.Failure("Successfully updated the Rx");
        }
    }
}
