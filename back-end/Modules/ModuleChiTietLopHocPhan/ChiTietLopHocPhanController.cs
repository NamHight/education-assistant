using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
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
        [HttpGet("list-diem-so")]
        public async Task<ActionResult> GetAllDiemSoByLopHocAsync([FromQuery] ParamAllDiemSoByLopHocDto paramBaseDto)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.GetAllDiemSoByLopHocAsync(paramBaseDto);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetChiTietLopHocPhanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddChiTietLopHocPhanAsync([FromBody] RequestAddChiTietLopHocPhanDto model)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateChiTietLopHocPhanAsync(Guid id, [FromBody] RequestUpdateChiTietLopHocPhanDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpPut("update-list")]
        public async Task<ActionResult> UpdateListChiTietLopHocPhanAsync([FromBody] List<RequestUpdateChiTietLopHocPhanDto> model)
        {
            if (model == null || !model.Any())
            {
                return BadRequest("Danh sách truyền lên bị null hoặc rỗng.");
            }
            await _serviceMaster.ChiTietLopHocPhan.UpdateListChiTietLopHocPhanAsync(model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChiTietLopHocPhanAsync(Guid id)
        {
            await _serviceMaster.ChiTietLopHocPhan.DeleteAsync(id);
            return NoContent();
        }
        [HttpDelete("delete-list")]
        public async Task<ActionResult> DeleteListChiTietLopHocPhanAsync([FromBody] RequestDeleteChiTietLopHocPhanDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.DeleteListChiTietLopHocPhanAsync(model);
            return NoContent();
        }
    }
}
