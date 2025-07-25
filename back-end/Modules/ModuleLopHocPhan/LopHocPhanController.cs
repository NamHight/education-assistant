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
    public class LopHocPhanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public LopHocPhanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [Authorize(Policy = "QLKhoa")]
        [HttpGet]
        public async Task<ActionResult> GetAllLopHocPhanAsync([FromQuery] ParamLopHocPhanDto paramLopHocPhanDto)
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanAsync(paramLopHocPhanDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "Admin")]
        [HttpGet("lop-da-nop")]
        public async Task<ActionResult> GetAllLopHocPhanDaNopDiemAsync([FromQuery] ParamLopHocPhanDaNopDto param)
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanDaNopAsync(param);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("by-giang-vien")]
        public async Task<ActionResult> GetAllLopHocPhanByGiangVienAsync([FromQuery] ParamLopHocPhanSimpleDto paramLopHocPhanSimpleDto)
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanByGiangVienAsync(paramLopHocPhanSimpleDto);
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("by-lop-hoc-and-hoc-ky")]
        public async Task<ActionResult> GetAllLopHocPhanByLopHocAndHocKyAsync([FromQuery] ParamLopHocPhanForLichBieuDto paramLopHocPhanForLichBieuDto)
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanByLopHocAndHocKyAsync(paramLopHocPhanForLichBieuDto);
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("no-page")]
        public async Task<ActionResult> GetAllLopHocPhanNoPageAsync()
        {
            var result = await _serviceMaster.LopHocPhan.GetAllLopHocPhanNoPageAsync();
            return Ok(result);
        }
        [Authorize(Policy = "GiangVien")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetLopHocPhanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("them-lop-hkp")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddLopHocPhanAsync([FromForm] RequestAddLopHocPhanDto model)
        {
            var result = await _serviceMaster.LopHocPhan.CreateAsync(model);
            return Ok(result);
        }
        [Authorize(Policy = "Admin")]
        [HttpPost("them-auto")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddAutoLopHocPhanAsync([FromForm] RequestGenerateLopHocPhanDto model)
        {
            await _serviceMaster.LopHocPhan.CreateAutoLopHocPhanAsync(model);
            return Ok("created successfully.");
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateLopHocPhanAsync(Guid id, [FromForm] RequestUpdateSimpleLopHocPhanDto model)
        {
            await _serviceMaster.LopHocPhan.UpdateAsync(id, model); 
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}/update-trang-thai")]
        public async Task<ActionResult> UpdateTrangThaiLopHocPhanAsync(Guid id, [FromForm] int trangThai)
        {
            Console.WriteLine($"trangthai 9999999 {trangThai}");
            await _serviceMaster.LopHocPhan.UpdateTrangThaiAsync(id, trangThai); 
            return NoContent();
        }
        [Authorize(Policy = "QLKhoa")]
        [HttpPut("list-phan-cong")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateListLopHocPhanAsync([FromBody] List<RequestUpdateLopHocPhanDto> listRequest)
        {
            await _serviceMaster.LopHocPhan.UpdateListLophocPhanAsync(listRequest);
            return NoContent();
        }
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLopHocPhanAsync(Guid id)
        {
            await _serviceMaster.LopHocPhan.DeleteAsync(id);
            return NoContent();
        }
    }
}
