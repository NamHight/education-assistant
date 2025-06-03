using System.Text.Json;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleGiangVien;

[Route("api/giangviens")]
[ApiController]
public class GiangVienController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;

    public GiangVienController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllGiangVienAsync([FromQuery] ParamBaseDto paramBaseDto)
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienAsync(paramBaseDto);
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
        return Ok(result.data);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult> GetGiangVienByIdAsync(Guid id)
    {
        var result = await _serviceMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        return Ok(result);
    }
    [HttpPost]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddGiangVienAsync([FromBody] RequestAddGiangVienDto model)
    {
        var result = await _serviceMaster.GiangVien.CreateAsync(model);
        return Ok(result);
    }
    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdateGiangVienAsync(Guid id, [FromBody] RequestUpdateGiangVienDto model)
    {
        await _serviceMaster.GiangVien.UpdateAsync(id, model);
        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGiangVienAsync(Guid id)
    {
        await _serviceMaster.GiangVien.DeleteAsync(id);
        return NoContent();
    }
}