using System.Text.Json;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Param;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class ChuongTrinhDaoTaoController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public ChuongTrinhDaoTaoController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllChuongTrinhDaoTaoAsync([FromQuery] ParamChuongTrinhDaoTaoDto paramChuongTrinhDaoTaoDto)
        {
            var result = await _serviceMaster.ChuongTrinhDaoTao.GetAllChuongTrinhDaoTaoAsync(paramChuongTrinhDaoTaoDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}", Name = "GetChuongTrinhDaoTaoId")]
        public async Task<ActionResult> GetChuongTrinhDaoTaoByIdAsync(Guid id)
        {
            var result = await _serviceMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddChuongTrinhDaoTaoAsync([FromForm] RequestAddChuongTrinhDaoTaoDto model)
        {
            var result = await _serviceMaster.ChuongTrinhDaoTao.CreateAsync(model);
            return CreatedAtRoute("GetChuongTrinhDaoTaoId", new { id = result.Id }, result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateChuongTrinhDaoTaosAsync(Guid id, [FromForm] RequestUpdateChuongTrinhDaoTaoDto model)
        {
            await _serviceMaster.ChuongTrinhDaoTao.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChuongTrinhDaoTaoAsync(Guid id)
        {
            await _serviceMaster.ChuongTrinhDaoTao.DeleteAsync(id);
            return NoContent();
        }
    }
}
