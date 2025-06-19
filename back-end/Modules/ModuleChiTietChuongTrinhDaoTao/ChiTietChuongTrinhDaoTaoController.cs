using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class ChiTietChuongTrinhDaoTaoController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public ChiTietChuongTrinhDaoTaoController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("")]
        public async Task<ActionResult> GetAllChiTietChuongTrinhDaoTaoAsync([FromQuery] ParamBaseDto paramBaseDto)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetAllChiTietChuongTrinhDaoTaoAsync(paramBaseDto);
            Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
            return Ok(result.data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
            return Ok(result);
        }
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> AddChiTietChuongTrinhDaoTaoAsync([FromBody] RequestAddChiTietChuongTrinhDaoTaoDto model)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateChiTietChuongTrinhDaoTaoAsync(Guid id, [FromBody] RequestUpdateChiTietChuongTrinhDaoTaoDto model)
        {
            await _serviceMaster.ChiTietChuongTrinhDaoTao.UpdateAsync(id, model);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChiTietChuongTrinhDaoTaoAsync(Guid id)
        {
            await _serviceMaster.ChiTietChuongTrinhDaoTao.DeleteAsync(id);
            return NoContent();
        }
    }
}