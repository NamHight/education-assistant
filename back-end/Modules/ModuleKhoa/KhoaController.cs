using System.Text.Json;
using Education_assistant.Modules.ModuleKhoa.DTOs.Param;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleKhoa
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoaController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public KhoaController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("")]
        public async Task<ActionResult> GetAllKhoaAsync([FromQuery] ParamKhoaDto paramKhoaDto)
        {
            var result = await _serviceMaster.Khoa.GetAllPaginationAndSearchAsync(paramKhoaDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("no-page")]
        public async Task<ActionResult> GetAllKhoaNoPageAsync()
        {
            var result = await _serviceMaster.Khoa.GetAllKhoaNoPageAsync();
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetKhoaByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Khoa.GetKhoaByIdAsync(id, false);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddKhoaAsync([FromForm] RequestAddKhoaDto model)
        {
            var result = await _serviceMaster.Khoa.CreateAsync(model);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateKhoaAsync(Guid id, [FromForm] RequestUpdateKhoaDto model)
        {
            await _serviceMaster.Khoa.UpdateAsync(id, model);
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteKhoaAsync(Guid id)
        {
            await _serviceMaster.Khoa.DeleteAsync(id);
            return NoContent();
        }
    }
}
