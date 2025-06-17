using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Param;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleLichBieu
{
    [Route("api/[controller]")]
    [ApiController]
    public class LichBieuController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public LichBieuController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllLichBieuAsync([FromQuery] ParamPaginationBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.LichBieu.GetAllLichBieuAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("giangvien")]
        public async Task<ActionResult> GetAllLichBieuGiangVienAsync([FromQuery] ParamLichKhoaBieuGiangVienDto paramBaseDto)
        {
            var result = await _serviceMaster.LichBieu.GetLichKhoaBieuGiangVienAsync(paramBaseDto);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLichBieuByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LichBieu.GetLichBieuByIdAsync(id, false);
            return Ok(result);
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLichBieuAsync([FromBody] RequestAddLichBieuDto model)
        {
            var result = await _serviceMaster.LichBieu.CreateAsync(model);
            return Ok(result);
        }
        [HttpPost("copy-tuan")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddListLichBieuWithTuanAsync([FromBody] RequestAddLichBieuListTuanDto model)
        {
            await _serviceMaster.LichBieu.CopyTuanLichBieuAsync(model);
            return Ok("Sao chép tuần thành công.");
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLichBieuAsync(Guid id, [FromBody] RequestUpdateLichBieuDto model)
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
