using System.Text.Json;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleLopHoc
{
    [Route("api/[controller]")]
    [ApiController]
    public class LopHocController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public LopHocController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllLopHocAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.LopHoc.GetAllLopHocAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetLopHocByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LopHoc.GetLopHocByIdAsync(id, false);
            return Ok(result);
        }

        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLopHocAsync([FromBody] RequestAddLopHocDto model)
        {
            var result = await _serviceMaster.LopHoc.CreateAsync(model);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLopHocAsync(Guid id, [FromBody] RequestUpdateLopHocDto model)
        {
            await _serviceMaster.LopHoc.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLopHocAsync(Guid id)
        {
            await _serviceMaster.LopHoc.DeleteAsync(id);
            return NoContent();
        }
    }
}
