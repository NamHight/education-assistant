using System.Text.Json;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Param;
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
        public async Task<ActionResult> GetAllChiTietChuongTrinhDaoTaoAsync([FromQuery] ParamChiTietChuongTrinhDaoTaoDto paramChiTietChuongTrinhDaoTaoDto)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetAllChiTietChuongTrinhDaoTaoAsync(paramChiTietChuongTrinhDaoTaoDto);
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
        public async Task<ActionResult> AddChiTietChuongTrinhDaoTaoAsync([FromForm] RequestAddChiTietChuongTrinhDaoTaoDto model)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.CreateAsync(model);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<ActionResult> UpdateChiTietChuongTrinhDaoTaoAsync(Guid id, [FromForm] RequestUpdateChiTietChuongTrinhDaoTaoDto model)
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

        [HttpGet("ChuongTrinhDaoTao/{id}")]
        public async Task<ActionResult> GetChiTietChuongTrinhDaoTaoByCTDTIdAsync(Guid id, [FromQuery] int? hocKy = null)
        {
           
            if (hocKy == null)
            {
                var resultWithoutHocKy = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetAllCtctdtByCtdtIdAsync(id);
                return Ok(resultWithoutHocKy);
            }
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetAllCtctdtByCtdtIdAsync(id, hocKy);
            return Ok(result);

        }
        [HttpGet("by-subject/{monHocId}")]
        public async Task<ActionResult> GetChiTietChuongTrinhDaoTaoByMonHocIdAsync(Guid monHocId)
        {
            var result = await _serviceMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByMonHocIdAsync(monHocId, false);
            return Ok(result);
        }
    }
}