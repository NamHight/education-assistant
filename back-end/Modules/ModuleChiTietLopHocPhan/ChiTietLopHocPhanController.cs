using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietLopHocPhanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public ChiTietLopHocPhanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllChiTietLopHocPhanAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.GetAllChiTietLopHocPhanAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetChiTietLopHocPhanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        public async Task<ActionResult> AddChiTietLopHocPhanAsync([FromBody] RequestAddChiTietLopHocPhanDto model)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateChiTietLopHocPhanAsync(Guid id, [FromBody] RequestUpdateChiTietLopHocPhanDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpPut("update-list")]
        public async Task<ActionResult> UpdateListChiTietLopHocPhanAsync([FromBody] List<RequestUpdateChiTietLopHocPhanDto> model)
        {
            await _serviceMaster.ChiTietLopHocPhan.UpdateListChiTietLopHocPhanAsync(model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChiTietLopHocPhanAsync(Guid id)
        {
            await _serviceMaster.ChiTietLopHocPhan.DeleteAsync(id);
            return NoContent();
        }
    }
}
