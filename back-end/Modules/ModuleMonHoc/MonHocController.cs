using System.Text.Json;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NLog.Filters;

namespace Education_assistant.Modules.ModuleMonHoc
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonHocController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public MonHocController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllMonHocAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.MonHoc.GetAllPaginationAndSearchAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetMonHocByIdAsync(Guid id)
        {
            var result = await _serviceMaster.MonHoc.GetMonHocByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddMonHocAsync([FromBody] RequestAddMonHocDto model)
        {
            var result = await _serviceMaster.MonHoc.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateMonHocAsync(Guid id, [FromBody] RequestUpdateMonHocDto model)
        {
            await _serviceMaster.MonHoc.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMonHocAsync(Guid id)
        {
            await _serviceMaster.MonHoc.DeleteAsync(id);
            return NoContent();
        }
    }
}
