using System.Text.Json;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleKhoa
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoaController : ControllerBase
    {
         private readonly IServiceMaster _serviceMaster;

        public KhoaController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("get-all-khoa")]
        public async Task<ActionResult> GetAllKhoaAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.Khoa.GetAllPaginationAndSearchAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("get-id-khoa/{id}")]
        public async Task<ActionResult> GetKhoaByIdAsync(Guid id)
        {
            var result = await _serviceMaster.Khoa.GetKhoaByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost("add-khoa")]
        public async Task<ActionResult> AddTruongAsync([FromBody] RequestAddKhoaDto model)
        {
            var result = await _serviceMaster.Khoa.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("update-khoa/{id}")]
        public async Task<ActionResult> UpdateTruongAsync(Guid id, [FromBody] RequestUpdateKhoaDto model)
        {
            await _serviceMaster.Khoa.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("delete-khoa/{id}")]
        public async Task<ActionResult> DeleteTruongAsync(Guid id)
        {
            await _serviceMaster.Khoa.DeleteAsync(id);
            return NoContent();
        }
    }
}
