using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class ChiTietLopHocPhanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public ChiTietLopHocPhanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllChiTietLopHocPhanAsync([FromQuery] ParamChiTietLopHocPhanDto paramChiTietLopHocPhanDto)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.GetAllChiTietLopHocPhanAsync(paramChiTietLopHocPhanDto);
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
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddChiTietLopHocPhanAsync([FromForm] RequestAddChiTietLopHocPhanDto model)
        {
            var result = await _serviceMaster.ChiTietLopHocPhan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateChiTietLopHocPhanAsync(Guid id, [FromForm] RequestUpdateChiTietLopHocPhanDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpPut("{id}/update-nop-diem")]
        public async Task<ActionResult> UpdateNopDiemChiTietLopHocPhanAsync(Guid id)
        {
            await _serviceMaster.ChiTietLopHocPhan.UpdateNopDiemChiTietLopHocPhanAsync(id);
            return NoContent();
        }
        [HttpPut("update-list")]
        public async Task<ActionResult> UpdateListChiTietLopHocPhanAsync([FromForm] List<RequestUpdateChiTietLopHocPhanDto> model)
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
        public async Task<ActionResult> DeleteListChiTietLopHocPhanAsync([FromForm] RequestDeleteChiTietLopHocPhanDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.DeleteListChiTietLopHocPhanAsync(model);
            return NoContent();
        }

        [HttpGet("{id}/export")]
        public async Task<ActionResult> ExportAsync(Guid id)
        {
            try
            {
                var fileContents = await _serviceMaster.ChiTietLopHocPhan.ExportFileExcelAsync(id);
                var fileName = $"DanhSachDiemSo_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
                return File(fileContents, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { Message = $"Lỗi khi xuất file: {ex.Message}" });
            }
        }
        [HttpPost("import")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> ImportAsync([FromForm] RequestImportFileDiemSoDto model)
        {
            await _serviceMaster.ChiTietLopHocPhan.ImportFileExcelAsync(model);
            return Ok("Import file cập nhật điểm số thành công.");
        }
    }
}
