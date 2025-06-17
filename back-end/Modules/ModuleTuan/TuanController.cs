using System.Text.Json;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
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
        [HttpGet()]
        public async Task<ActionResult> GetAllTuanAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.Tuan.GetAllTuanAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetTuanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Tuan.GetTuanByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddTuanAsync([FromBody] RequestAddTuanDto model)
        {
            var result = await _serviceMaster.Tuan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateTuanAsync(Guid id, [FromBody] RequestUpdateTuanDto model)
        {
            await _serviceMaster.Tuan.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTuanAsync(Guid id)
        {
            await _serviceMaster.Tuan.DeleteAsync(id);
            return NoContent();
        }
    }
}
