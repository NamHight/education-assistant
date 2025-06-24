using System.Text.Json;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleLopHocPhan
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class LopHocPhanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public LopHocPhanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllLopHocPhanAsync([FromQuery] ParamLopHocPhanDto paramLopHocPhanDto)
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanAsync(paramLopHocPhanDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLopHocPhanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("them-lop-hkp")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLopHocPhanAsync([FromForm] RequestAddLopHocPhanDto model)
        {
            var result = await _serviceMaster.LopHocPhan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPost("them-auto")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddAutoLopHocPhanAsync([FromForm] RequestGenerateLopHocPhanDto model)
        {
            await _serviceMaster.LopHocPhan.CreateAutoLopHocPhanAsync(model);
            return Ok("created successfully.");
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLopHocPhanAsync(Guid id, [FromForm] RequestUpdateLopHocPhanDto model)
        {
            await _serviceMaster.LopHocPhan.UpdateAsync(id, model); 
            return NoContent();
        }
        [HttpPut("list-phan-cong")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateListLopHocPhanAsync([FromBody] List<RequestUpdateLopHocPhanDto> listRequest)
        {
            await _serviceMaster.LopHocPhan.UpdateListLophocPhanAsync(listRequest);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLopHocPhanAsync(Guid id)
        {
            await _serviceMaster.LopHocPhan.DeleteAsync(id);
            return NoContent();
        }
    }
}
