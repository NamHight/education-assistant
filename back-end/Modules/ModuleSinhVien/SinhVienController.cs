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
        [HttpGet("by-lop-hoc-phan")]
        public async Task<ActionResult> GetAllSinhVienByLopHocPhanAsync([FromQuery] ParamSinhVienByLopHocPhanDto paramSinhVienByLopHocPhanDto)
        {
            var result = await _serviceMaster.SinhVien.GetAllSinhVienByLopHocPhanIdAsync(paramSinhVienByLopHocPhanDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{lopHocId}/by-lop-hoc")]
        public async Task<ActionResult> GetAllSinhVienByLopHocAsync(Guid lopHocId)
        {
            var result = await _serviceMaster.SinhVien.GetAllSinhVienByLopHocIdAsync(lopHocId);
            return Ok(result);
        }
        [HttpGet("all-tinh-trang-hoc-tap")]
        public async Task<ActionResult> GetAllSummaryAsync([FromQuery] Guid lopId)
        {
            var result = await _serviceMaster.SinhVien.GetALlSummaryAsync(lopId);
            return Ok(result);
        }
        [HttpGet("mssv")]
        public async Task<ActionResult> GetSinhVienByMssvAsync([FromQuery] string mssv)
        {
            var result = await _serviceMaster.SinhVien.GetSinhVienByMssvAsync(mssv);
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
        [HttpPost("chuyen-lop")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddSinhVienLopHocAsync([FromBody] RequestAddSinhVienChuyenLopDto model)
        {
            await _serviceMaster.SinhVien.UpdateChuyenSinhVienByLopHocAsync(model);
            return Ok("Chuyển sinh viên sang lớp học thành công");
        }
        [HttpPost("dang-ky-mon-hoc")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddSinhVienDangKyMonHocAsync([FromForm] RequestSinhVienDangKyMonHocDto model)
        {
            var result = await _serviceMaster.SinhVien.CreateSinhVienDangKyMonHocAsync(model);
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
        [HttpDelete("{sinhVienId}/lhp/{lopHocPhanId}/xoa-sv-khoi-lhp")]
        public async Task<ActionResult> DeleteSinhVienAsync(Guid sinhVienId, Guid lopHocPhanId)
        {
            await _serviceMaster.SinhVien.DeleteSinhVienKhoiLopHocPhanAsync(sinhVienId, lopHocPhanId);
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
