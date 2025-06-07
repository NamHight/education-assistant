using System.Text.Json;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleHocBa
{
    [Route("api/[controller]")]
    [ApiController]
    public class HocBaController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public HocBaController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllHocBaAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.HocBa.GetAllHocBaAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetHocBaByIdAsync(Guid id)
        {
            var result = await _serviceMaster.HocBa.GetHocBaByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddHocBaAsync([FromBody] RequestAddHocbaDto model)
        {
            var result = await _serviceMaster.HocBa.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateHocBaAsync(Guid id, [FromBody] RequestUpdateHocbaDto model)
        {
            await _serviceMaster.HocBa.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteHocBaAsync(Guid id)
        {
            await _serviceMaster.HocBa.DeleteAsync(id);
            return NoContent();
        }
    }
}
