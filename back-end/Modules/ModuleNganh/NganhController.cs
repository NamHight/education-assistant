using System.Text.Json;
using Education_assistant.Modules.ModuleNganh.DTOs.Param;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleNganh
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class NganhController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public NganhController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllNganhAsync([FromQuery] ParamNganhDto paramNganhDto)
        {
            var result = await _serviceMaster.Nganh.GetAllNganhAsync(paramNganhDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetNganhByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Nganh.GetNganhByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddNganhAsync([FromForm] RequestAddNganhDto model)
        {
            var result = await _serviceMaster.Nganh.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateNganhAsync(Guid id, [FromForm] RequestUpdateNganhDto model)
        {
            await _serviceMaster.Nganh.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNganhAsync(Guid id)
        {
            await _serviceMaster.Nganh.DeleteAsync(id);
            return NoContent();
        }
    }
}
