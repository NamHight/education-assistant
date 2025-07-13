using System.Text.Json;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Param;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModulePhongHoc;

[Route("api/[controller]")]
[ApiController]
public class PhongHocController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;

    public PhongHocController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet]
    public async Task<ActionResult> GetAllPhongHocAsync([FromQuery] ParamPhongHocDto paramPhongHocDto)
    {
        var result = await _serviceMaster.PhongHoc.GetAllPhongHocAsync(paramPhongHocDto);
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
        return Ok(result.data);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("no-page")]
    public async Task<ActionResult> GetAllPhongHocNoPageAsync()
    {
        var result = await _serviceMaster.PhongHoc.GetAllPhongHocNoPageAsync();
        return Ok(result);
    }

    // [HttpGet("toa-nha-combobox")]
    // public async Task<ActionResult> GetAllToaNhaAsync()
    // {
    //     var result = await _serviceMaster.PhongHoc.GetAllToaNhaAsync();
    //     return Ok(result);
    // }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("{id}")]
    public async Task<ActionResult> GetPhongHocByIdAsync(Guid id)
    {
        var result = await _serviceMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
        return Ok(result);
    }
    [Authorize(Policy = "Admin")]
    [HttpPost]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddPhongHocAsync([FromBody] RequestAddPhongHocDto model)
    {
        var result = await _serviceMaster.PhongHoc.CreateAsync(model);
        return Ok(result);
    }

    // [HttpPost("virtual-list")]
    // [ServiceFilter(typeof(ValidationFilter))]
    // public async Task<ActionResult> GenericPhongHocAutoVirtualListAsync([FromForm] RequestAddPhongHocVirtualListDto model)
    // {
    //     var result = await _serviceMaster.PhongHoc.GenericPhongHocAutoVirtualListAsync(model);
    //     return Ok(result);
    // }
    [Authorize(Policy = "Admin")]
    [HttpPost("create-list")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> GenericPhongHocAutoVirtualListAsync([FromBody] RequestAddPhongHocAutoDto model)
    {
        var result = await _serviceMaster.PhongHoc.CreateListPhongHocAsync(model);
        return Ok(result);
    }
    [Authorize(Policy = "Admin")]
    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdatePhongHocAsync(Guid id, [FromForm] RequestUpdatePhongHocDto model)
    {
        await _serviceMaster.PhongHoc.UpdateAsync(id, model);
        return NoContent();
    }
    [Authorize(Policy = "Admin")]
    [HttpPut("{id}/update-option")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdatePhongHocOptionAsync(Guid id, [FromForm] RequestUpdatePhongHocOptionDto model)
    {
        await _serviceMaster.PhongHoc.UpdateOptionalAsync(id, model);
        return NoContent();
    }

    [Authorize(Policy = "Admin")]
    [HttpPatch("{id}/update-trang-thai")]
    public async Task<ActionResult> UpdateTrangThaiLopHocPhanAsync(Guid id, [FromForm] int trangThai)
    {
        await _serviceMaster.PhongHoc.UpdateTrangThaiAsync(id, trangThai);
        return NoContent();
    }
    [Authorize(Policy = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePhongHocAsync(Guid id)
    {
        await _serviceMaster.PhongHoc.DeleteAsync(id);
        return NoContent();
    }
}