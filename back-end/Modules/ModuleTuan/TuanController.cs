using System.Text.Json;
using Education_assistant.Modules.ModuleTuan.DTOs.Param;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleTuan
{
    [Route("api/[controller]")]
    [ApiController]
    public class TuanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public TuanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet()]
        public async Task<ActionResult> GetAllTuanAsync([FromQuery] ParamTuanDto paramTuanDto)
        {
            var result = await _serviceMaster.Tuan.GetAllTuanAsync(paramTuanDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("by-nam-hoc")]
        public async Task<ActionResult> GetAllTuanAsync([FromQuery] int namHoc)
        {
            var result = await _serviceMaster.Tuan.GetALLTuanByNamHocAsync(namHoc);
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("combobox-copy")]
        public async Task<ActionResult> GetTuanComboBoxAsync([FromQuery] ParamTuanCopyDto paramTuanDto)
        {
            var result = await _serviceMaster.Tuan.GetTuanComboBoxAsync(paramTuanDto);
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetTuanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Tuan.GetTuanByIdAsync(id, false);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddTuanAsync([FromForm] RequestAddTuanDto model)
        {
            var result = await _serviceMaster.Tuan.CreateAsync(model);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("tao-auto-tuan")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddTuanAutoAsync([FromForm] RequestAddTuanByNamAndNgayBatDauDto model)
        {
            await _serviceMaster.Tuan.CreateAutoTuanForNamHocAsnyc(model);
            return Ok("Tạo danh sách tuần thành công");
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateTuanAsync(Guid id, [FromForm] RequestUpdateTuanDto model)
        {
            await _serviceMaster.Tuan.UpdateAsync(id, model);
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTuanAsync(Guid id)
        {
            await _serviceMaster.Tuan.DeleteAsync(id);
            return NoContent();
        }
    }
}
