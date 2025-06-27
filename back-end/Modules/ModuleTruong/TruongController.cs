using Education_assistant.Modules.ModuleTruong.DTOs.Param;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleTruong;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "GiangVien")]
public class TruongController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;
    public TruongController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }
    [HttpGet("key-value")]
    public async Task<ActionResult> GetTruongAsync()
    {
        var result = await _serviceMaster.Truong.GetTruongAsync();
        return Ok(result);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult> GetTruongByIdAsync(Guid id)
    {
        var result = await _serviceMaster.Truong.GetTruongByIdAsync(id, false);
        return Ok(result);
    }
    [HttpPost("")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddTruongAsync([FromForm] RequestAddTruongDto model)
    {
        var result = await _serviceMaster.Truong.CreateAsync(model);
        return Ok(result);
    }
    [HttpPut("{id}/import-image")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> ImportFileImage(Guid id,[FromForm] RequestUpdateFileTruongDto model)
    {
        await _serviceMaster.Truong.ImportFileImageTruongAsync(id, model);
        return Ok("Cập nhật hình ảnh thành công.");
    }
    [HttpPut]
    public async Task<ActionResult> UpdateTruongAsync([FromForm] RequestUpdateTruongDto model)
    {
        await _serviceMaster.Truong.UpdateAsync(model);
        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTruongAsync(Guid id)
    {
        await _serviceMaster.Truong.DeleteAsync(id);
        return NoContent();
    }

}