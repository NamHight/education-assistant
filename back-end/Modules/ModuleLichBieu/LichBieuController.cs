using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Param;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleLichBieu
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class LichBieuController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public LichBieuController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllLichBieuAsync([FromQuery] ParamLichBieuDto paramLichBieuDto)
        {
            var result = await _serviceMaster.LichBieu.GetAllLichBieuAsync(paramLichBieuDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLichBieuByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LichBieu.GetLichBieuByIdAsync(id, false);
            return Ok(result);
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLichBieuAsync([FromForm] RequestAddLichBieuDto model)
        {
            var result = await _serviceMaster.LichBieu.CreateAsync(model);
            return Ok(result);
        }
        [HttpPost("copy")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddListLichBieuWithTuanAsync([FromBody] RequestAddLichBieuListTuanDto model)
        {
            await _serviceMaster.LichBieu.CopyTuanLichBieuAsync(model);
            return Ok("Sao chép tuần thành công.");
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLichBieuAsync(Guid id, [FromForm] RequestUpdateLichBieuDto model)
        {
            await _serviceMaster.LichBieu.UpdateAsync(id, model);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLichBieuAsync(Guid id)
        {
            await _serviceMaster.LichBieu.DeleteAsync(id);
            return NoContent();
        }
    }
}
