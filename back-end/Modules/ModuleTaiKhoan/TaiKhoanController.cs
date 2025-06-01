using System.Text.Json;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleTaiKhoan
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public TaiKhoanController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("get-all-taikhoan")]
        public async Task<ActionResult> GetAllTaiKhoanAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.TaiKhoan.GetAllTaiKhoaAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("get-id-taikhoan/{id}")]
        public async Task<ActionResult> GetTaiKhoanByIdAsync(Guid id)
        {
            var result = await _serviceMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("add-taikhoan")]
        public async Task<ActionResult> AddTaiKhoanAsync([FromBody] RequestAddTaiKhoanDto model)
        {
            var result = await _serviceMaster.TaiKhoan.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("update-taikhoan/{id}")]
        public async Task<ActionResult> UpdateTaiKhoanAsync(Guid id, [FromBody] RequestUpdateTaiKhoanDto model)
        {
            await _serviceMaster.TaiKhoan.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpPut("update-status-taikhoan/{id}")]
        public async Task<ActionResult> UpdateTaiKhoanAsync(Guid id)
        {
            await _serviceMaster.TaiKhoan.UpdateStatusAsync(id);
            return NoContent();
        }
        [HttpDelete("delete-taikhoan/{id}")]
        public async Task<ActionResult> DeleteTaiKhoanAsync(Guid id)
        {
            await _serviceMaster.TaiKhoan.DeleteAsync(id);
            return NoContent();
        }
    }
}
