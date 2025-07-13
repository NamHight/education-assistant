using System.Text.Json;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Param;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Policy = "GiangVien")]
        [HttpGet]
        public async Task<ActionResult> GetAllLopHocAsync([FromQuery] ParamLopHocDto paramLopHocDto)
        {
            var result = await _serviceMaster.LopHoc.GetAllLopHocAsync(paramLopHocDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("no-page")]
        public async Task<ActionResult> GetAllLopHocNoPageAsync()
        {
            var result = await _serviceMaster.LopHoc.GetAllLopHocNoPageAsync();
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLopHocByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LopHoc.GetLopHocByIdAsync(id, false);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLopHocAsync([FromForm] RequestAddLopHocDto model)
        {
            var result = await _serviceMaster.LopHoc.CreateAsync(model);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLopHocAsync(Guid id, [FromForm] RequestUpdateLopHocDto model)
        {
            await _serviceMaster.LopHoc.UpdateAsync(id, model);
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLopHocAsync(Guid id)
        {
            await _serviceMaster.LopHoc.DeleteAsync(id);
            return NoContent();
        }
    }
}
