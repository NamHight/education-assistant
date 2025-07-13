using System.Text.Json;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Param;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NLog.Filters;

namespace Education_assistant.Modules.ModuleMonHoc
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class MonHocController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public MonHocController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet]
        public async Task<ActionResult> GetAllMonHocAsync([FromQuery] ParamMonHocDto paramMonHocDto)
        {
            var result = await _serviceMaster.MonHoc.GetAllPaginationAndSearchAsync(paramMonHocDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetMonHocByIdAsync(Guid id)
        {
            var result = await _serviceMaster.MonHoc.GetMonHocByIdAsync(id, false);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddMonHocAsync([FromForm] RequestAddMonHocDto model)
        {
            var result = await _serviceMaster.MonHoc.CreateAsync(model);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateMonHocAsync(Guid id, [FromForm] RequestUpdateMonHocDto model)
        {
            await _serviceMaster.MonHoc.UpdateAsync(id, model);
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMonHocAsync(Guid id)
        {
            await _serviceMaster.MonHoc.DeleteAsync(id);
            return NoContent();
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("by-khoa/{khoaId}")]
        public async Task<ActionResult> GetMonHocByKhoaIdAsync(Guid khoaId)
        {
            var result = await _serviceMaster.MonHoc.GetMonHocByKhoaIdAsync(khoaId, false);
            return Ok(result);
        }
    }
}
