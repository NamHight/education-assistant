using System.Text.Json;
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
    [Authorize(Policy = "GiangVien")]
    public class KhoaController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public KhoaController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllKhoaAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.Khoa.GetAllPaginationAndSearchAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetKhoaByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Khoa.GetKhoaByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddKhoaAsync([FromBody] RequestAddKhoaDto model)
        {
            var result = await _serviceMaster.Khoa.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateKhoaAsync(Guid id, [FromBody] RequestUpdateKhoaDto model)
        {
            await _serviceMaster.Khoa.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteKhoaAsync(Guid id)
        {
            await _serviceMaster.Khoa.DeleteAsync(id);
            return NoContent();
        }
    }
}
