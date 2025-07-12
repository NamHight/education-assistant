using System.Text.Json;
using Education_assistant.Modules.ModuleNganh.DTOs.Param;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleNganh;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "GiangVien")]
public class NganhController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;

    public NganhController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllNganhAsync([FromQuery] ParamNganhDto paramNganhDto)
    {
        var result = await _serviceMaster.Nganh.GetAllNganhAsync(paramNganhDto);
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
        return Ok(result.data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetNganhByIdAsync(Guid id)
    {
        var result = await _serviceMaster.Nganh.GetNganhByIdAsync(id, false);
        return Ok(result);
    }

    [HttpPost("")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddNganhAsync([FromForm] RequestAddNganhDto model)
    {
        var result = await _serviceMaster.Nganh.CreateAsync(model);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdateNganhAsync(Guid id, [FromForm] RequestUpdateNganhDto model)
    {
        await _serviceMaster.Nganh.UpdateAsync(id, model);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNganhAsync(Guid id)
    {
        await _serviceMaster.Nganh.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("no-page")]
    public async Task<IActionResult> GetALlNoPage()
    {
        var result = await _serviceMaster.Nganh.GetAllNganhNoPage();
        return Ok(result);
    }

    [HttpGet("no-parent/{khoaId}")]
    public async Task<IActionResult> GetALlNganhNoPageNoParentByKhoaIdAsync(Guid khoaId)
    {
        var result = await _serviceMaster.Nganh.GetALlNganhNoPageNoParentByKhoaIdAsync(khoaId);
        return Ok(result);
    }

    [HttpGet("by-khoa/{khoaId}")]
    public async Task<IActionResult> GetNganhByKhoaIdAsync(Guid khoaId)
    {
        var result = await _serviceMaster.Nganh.GetALlNganhByKhoaIdAsync(khoaId);
        return Ok(result);
    }
}