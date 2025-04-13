using Hospital.Application.Constants;
using Hospital.Application.DTOs.RxInfo;
using Hospital.Application.Interfaces;
using Hospital.Server.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RxInfoController : BaseApiController
    {
        private readonly IRxInfoService _rxInfoService;

        public RxInfoController(IRxInfoService rxInfoService)
        {
            _rxInfoService = rxInfoService;
        }

        [HttpGet("{id}")]
        [CheckPermission(Permissions.ViewMedicine)]
        public async Task<ActionResult<RxInfoDTO>> GetById(int id)
        {
            var result = await _rxInfoService.GetRxById(id);
            return HandleServiceResult(result);
        }

        [HttpGet]
        [CheckPermission(Permissions.ViewMedicine)]
        public async Task<ActionResult<IEnumerable<RxInfoDTO>>> GetAll()
        {
            var rxInfos = await _rxInfoService.GetAllRx();
            return Ok(rxInfos);
        }

        [HttpPost]
        [CheckPermission(Permissions.CreateMedicine)]
        public async Task<ActionResult<RxInfoDTO>> Create([FromBody] CreateUpdateRxInfoDTO rxDTO)
        {
            var result = await _rxInfoService.Create(rxDTO);
            return HandleServiceResult(result);
        }

        [HttpPut("{id}")]
        [CheckPermission(Permissions.EditMedicine)]
        public async Task<ActionResult<RxInfoDTO>> Update(int id, [FromBody] CreateUpdateRxInfoDTO rxDTO)
        {
            var result = await _rxInfoService.Update(id, rxDTO);
            return HandleServiceResult(result);
        }

        [HttpDelete("{id}")]
        [CheckPermission(Permissions.DeleteMedicine)]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _rxInfoService.Delete(id);
            return HandleServiceResult(result);
        }
    }
}
