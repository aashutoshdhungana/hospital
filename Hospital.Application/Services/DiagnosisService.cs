using Hospital.Application.DTOs.Diagnosis;
using Hospital.Application.Interfaces;
using Hospital.Application.Models;
using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Aggregates.Rx;
using Mapster;

namespace Hospital.Application.Services
{
    public class DiagnosisService : IDiagnosisService
    {
        private readonly IDiagnosisInfoRepository _repository;
        private readonly IRxRepository _rxRepository;
        private readonly ICurrentUserService _currentUserService;
        public DiagnosisService(IDiagnosisInfoRepository repository,
            ICurrentUserService currentUserService,
            IRxRepository rxRepository)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _rxRepository = rxRepository;
        }

        public async Task<ServiceResult<IEnumerable<DiagnosisViewModel>>> GetAllAsync()
        {
            var result = await _repository.GetAll();
            return ServiceResult<IEnumerable<DiagnosisViewModel>>.Success(result.Adapt<IEnumerable<DiagnosisViewModel>>());
        }

        public async Task<ServiceResult<DiagnosisViewModel>> GetByIdAsync(int id)
        {
            var result = await _repository.GetById(id);
            if (result == null)
                return ServiceResult<DiagnosisViewModel>.NotFound();

            return ServiceResult<DiagnosisViewModel>.Success(result.Adapt<DiagnosisViewModel>());
        }

        public async Task<ServiceResult<DiagnosisViewModel>> CreateAsync(CreateUpdateDiagnosis viewModel)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<DiagnosisViewModel>.Unauthorized();

            var diagnosis = new DiagnosisInfo(viewModel.DiagnosisText, viewModel.Code, _currentUserService.UserId.Value);
            _repository.Add(diagnosis);
            var isSuccess = await _repository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<DiagnosisViewModel>.Success(diagnosis.Adapt<DiagnosisViewModel>())
                : ServiceResult<DiagnosisViewModel>.Failure("Failed to create diagnosis");
        }

        public async Task<ServiceResult<DiagnosisViewModel>> UpdateAsync(int id, CreateUpdateDiagnosis diagnosis)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<DiagnosisViewModel>.Unauthorized();

            var existing = await _repository.GetById(id);
            if (existing == null)
                return ServiceResult<DiagnosisViewModel>.NotFound();

            existing.Update(diagnosis.DiagnosisText, diagnosis.Code, _currentUserService.UserId.Value);
            _repository.Update(existing);
            var isSuccess = await _repository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<DiagnosisViewModel>.Success(existing.Adapt<DiagnosisViewModel>())
                : ServiceResult<DiagnosisViewModel>.Failure("Failed to update diagnosis");
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<bool>.Unauthorized();

            var existing = await _repository.GetById(id);
            if (existing == null)
                return ServiceResult<bool>.NotFound();

            _repository.Delete(existing);
            var isSuccess = await _repository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<bool>.Success(true)
                : ServiceResult<bool>.Failure("Failed to delete diagnosis");
        }

        public async Task<ServiceResult<string>> AddPrescription(int id, int rxId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var existing = await _repository.GetById(id);
            if (existing == null)
                return ServiceResult<string>.NotFound();

            var rx = await _rxRepository.Get(rxId);
            if (rx == null)
                return ServiceResult<string>.NotFound();

            existing.AddPrescription(rx);
            _repository.Update(existing);
            var isSuccess = await _repository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully added prescription")
                : ServiceResult<string>.Success("Failed to add prescription");
        }

        public async Task<ServiceResult<string>> RemovePrescription(int id, int rxId)
        {
            if (!_currentUserService.UserId.HasValue)
                return ServiceResult<string>.Unauthorized();

            var existing = await _repository.GetById(id);
            if (existing == null)
                return ServiceResult<string>.NotFound();

            var rx = existing.Prescriptions.FirstOrDefault(x => x.Id == rxId);
            if (rx == null)
                return ServiceResult<string>.NotFound();

            existing.RemovePrescription(rx);
            _repository.Update(existing);
            var isSuccess = await _repository.UnitOfWork.CommitAsync();
            return isSuccess ? ServiceResult<string>.Success("Successfully removed prescription")
                : ServiceResult<string>.Failure("Failed to remove prescription");
        }
    }
}
