using System.Text.Json;
using Education_assistant.Modules.ModuleBoMon.DTOs.Param;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleBoMon
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class BoMonController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public BoMonController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllBoMonAsync([FromQuery] ParamBoMonDto paramBoMonDto)
        {
            var result = await _serviceMaster.BoMon.GetAllBoMonAsync(paramBoMonDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("no-page")]
        public async Task<ActionResult> GetAllBoMonNoPageAsync()
        {
            var result = await _serviceMaster.BoMon.GetAllBoMonNoPageAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetBoMonByIdAsync(Guid id)
        {
            var result = await _serviceMaster.BoMon.GetBoMonByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddBoMonAsync([FromForm] RequestAddBoMonDto model)
        {
            var result = await _serviceMaster.BoMon.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateBoMonAsync(Guid id, [FromForm] RequestUpdateBoMonDto model)
        {
            await _serviceMaster.BoMon.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBoMonAsync(Guid id)
        {
            await _serviceMaster.BoMon.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("by-khoa/{khoaId}")]
        public async Task<ActionResult> GetBoMonByKhoaIdAsync(Guid khoaId)
        {
            var result = await _serviceMaster.BoMon.GetBoMonByKhoaIdAsync(khoaId, false);
            return Ok(result);
        }
    }
}
