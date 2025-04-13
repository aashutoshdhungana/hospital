using Hospital.Application.DTOs.RxInfo;
using Hospital.Application.Models;

namespace Hospital.Application.Interfaces
{
    public interface IRxInfoService
    {
        public Task<ServiceResult<RxInfoDTO>> GetRxById(int id);
        public Task<IEnumerable<RxInfoDTO>> GetAllRx();
        public Task<ServiceResult<RxInfoDTO>> Create(CreateUpdateRxInfoDTO rxDTO);
        public Task<ServiceResult<RxInfoDTO>> Update(int id, CreateUpdateRxInfoDTO rxDTO);
        public Task<ServiceResult<RxInfoDTO>> Delete(int id);
    }
}
