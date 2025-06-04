using System.Text.Json;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleBoMon
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoMonController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public BoMonController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllBoMonAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.BoMon.GetAllBoMonAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetBoMonByIdAsync(Guid id)
        {
            var result = await _serviceMaster.BoMon.GetBoMonByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddBoMonAsync([FromBody] RequestAddBoMonDto model)
        {
            var result = await _serviceMaster.BoMon.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateBoMonAsync(Guid id, [FromBody] RequestUpdateBoMonDto model)
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
    }
}
