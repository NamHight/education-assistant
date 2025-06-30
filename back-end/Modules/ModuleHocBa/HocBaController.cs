using System.Text.Json;
using Education_assistant.Modules.ModuleHocBa.DTOs.Param;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleHocBa;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "GiangVien")]
public class HocBaController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;

    public HocBaController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }

    [HttpGet("")]
    public async Task<ActionResult> GetAllHocBaAsync([FromQuery] ParamHocBaDto paramHocBaDto)
    {
        var result = await _serviceMaster.HocBa.GetAllHocBaAsync(paramHocBaDto);
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
        return Ok(result.data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetHocBaByIdAsync(Guid id)
    {
        var result = await _serviceMaster.HocBa.GetHocBaByIdAsync(id, false);
        return Ok(result);
    }

    [HttpPost("")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddHocBaAsync([FromForm] RequestAddHocbaDto model)
    {
        var result = await _serviceMaster.HocBa.CreateAsync(model);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdateHocBaAsync(Guid id, [FromForm] RequestUpdateHocbaDto model)
    {
        await _serviceMaster.HocBa.UpdateAsync(id, model);
        return NoContent();
    }

    [HttpPut("nop-diem")]
    public async Task<ActionResult> UpdateListHocBaAsync([FromBody] RequestListUpdateHocbaDto model)
    {
        Console.WriteLine(JsonSerializer.Serialize(model));
        if (model == null) return BadRequest("Danh sách truyền lên bị null hoặc rỗng.");
        await _serviceMaster.HocBa.UpdateListHocBaAsync(model);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHocBaAsync(Guid id)
    {
        await _serviceMaster.HocBa.DeleteAsync(id);
        return NoContent();
    }

    [HttpDelete("delete-list")]
    public async Task<ActionResult> DeleteListHocBaAsync([FromBody] RequestDeleteHocBaDto model)
    {
        await _serviceMaster.HocBa.DeleteListHocBaAsync(model);
        return NoContent();
    }
}