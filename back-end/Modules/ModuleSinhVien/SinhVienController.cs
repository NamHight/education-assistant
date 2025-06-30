using System.Text.Json;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Param;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleSinhVien
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class SinhVienController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public SinhVienController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllSinhVienAsync([FromQuery] ParamSinhVienDto paramSinhVienDto)
        {
            var result = await _serviceMaster.SinhVien.GetAllSinhVienAsync(paramSinhVienDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("all-tinh-trang-hoc-tap")]
        public async Task<ActionResult> GetAllSummaryAsync([FromQuery] Guid lopId)
        {
            var result = await _serviceMaster.SinhVien.GetALlSummaryAsync(lopId);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetSinhVienByIdAsync(Guid id)
        {
            var result = await _serviceMaster.SinhVien.GetSinhVienByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPut("{id}/restore")]
        public async Task<ActionResult> GetReStoreSinhVienAsync(Guid id)
        {
            var result = await _serviceMaster.SinhVien.ReStoreSinhVienAsync(id);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddSinhVienAsync([FromForm] RequestAddSinhVienDto model)
        {
            var result = await _serviceMaster.SinhVien.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateSinhVienAsync(Guid id, [FromForm] RequestUpdateSinhVienDto model)
        {
            await _serviceMaster.SinhVien.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSinhVienAsync(Guid id)
        {
            await _serviceMaster.SinhVien.DeleteAsync(id);
            return NoContent();
        }
        [HttpGet("{lopId}/export")]
        public async Task<ActionResult> ExportAsync(Guid lopId)
        {
            try
            {
                var fileContents = await _serviceMaster.SinhVien.ExportFileExcelAsync(lopId);
                var fileName = $"DanhSachSinhVien_{DateTime.Now:ddMMyyyy}.xlsx";
                return File(fileContents, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { Message = $"Lỗi khi xuất file: {ex.Message}" });
            }
        }
        [HttpPost("import")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> ImportAsync([FromForm] RequestImportFileSinhVienDto model)
        {
            await _serviceMaster.SinhVien.ImportFileExcelAsync(model);
            return Ok("Import file thêm sinh viên thành công.");
        }
    }
}
