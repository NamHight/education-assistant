using System.Text.Json;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Param;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModulePhongHoc
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class PhongHocController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public PhongHocController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllPhongHocAsync([FromQuery] ParamPhongHocDto paramPhongHocDto)
        {
            var result = await _serviceMaster.PhongHoc.GetAllPhongHocAsync(paramPhongHocDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("no-page")]
        public async Task<ActionResult> GetAllPhongHocNoPageAsync()
        {
            var result = await _serviceMaster.PhongHoc.GetAllPhongHocNoPageAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetPhongHocByIdAsync(Guid id)
        {
            var result = await _serviceMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            return Ok(result);
        }

        [HttpPost()]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddPhongHocAsync([FromForm] RequestAddPhongHocDto model)
        {
            var result = await _serviceMaster.PhongHoc.CreateAsync(model);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdatePhongHocAsync(Guid id, [FromForm] RequestUpdatePhongHocDto model)
        {
            await _serviceMaster.PhongHoc.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpPatch("{id}/update-trang-thai")]
        public async Task<ActionResult> UpdateTrangThaiLopHocPhanAsync(Guid id, [FromForm] int trangThai)
        {
            await _serviceMaster.PhongHoc.UpdateTrangThaiAsync(id, trangThai); 
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePhongHocAsync(Guid id)
        {
            await _serviceMaster.PhongHoc.DeleteAsync(id);
            return NoContent();
        }
    }
}
