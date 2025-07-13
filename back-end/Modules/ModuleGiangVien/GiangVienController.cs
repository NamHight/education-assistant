using System.Text.Json;
using Education_assistant.Modules.ModuleGiangVien.Dtos.Param;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Policy = "GiangVien")]
    [HttpGet]
    public async Task<ActionResult> GetAllGiangVienAsync([FromQuery] ParamGiangVienDto paramBaseDto)
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienAsync(paramBaseDto);
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(result.page));
        return Ok(result.data);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("no-page")]
    public async Task<ActionResult> GetAllGiangVienNoPageAsync()
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienNoPageAsync();
        return Ok(result);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("tinh-trang-lam-viec")]
    public async Task<ActionResult> GetAllGiangViensummaryAsync([FromQuery] Guid khoaId)
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienSummaryAsync(khoaId);
        return Ok(result);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("{id}/by-khoa")]
    public async Task<ActionResult> GetAllGiangVienByAsync(Guid id)
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienByKhoa(id);
        return Ok(result);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("{boMonId}/by-bomon")]
    public async Task<ActionResult> GetAllGiangVienByBoMonAsync(Guid boMonId)
    {
        var result = await _serviceMaster.GiangVien.GetAllGiangVienByBoMonAsync(boMonId);
        return Ok(result);
    }
    [Authorize(Policy = "GiangVien")]
    [HttpGet("{id}")]
    public async Task<ActionResult> GetGiangVienByIdAsync(Guid id)
    {
        var result = await _serviceMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        return Ok(result);
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPut("{id}/change-status")]
    public async Task<ActionResult> ChangeStatusAsync(Guid id, [FromBody] RequestUpdateStatusGiangVienDto request)
    {
        await _serviceMaster.GiangVien.updateGiangVienStatusAsync(id, request.TrangThai);
        return NoContent();
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPut("{id}/restore")]
    public async Task<ActionResult> GetReStoreGiangVienAsync(Guid id)
    {
        var result = await _serviceMaster.GiangVien.ReStoreGiangVienAsync(id);
        return Ok(result);
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPost]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> AddGiangVienAsync([FromForm] RequestAddGiangVienDto model)
    {
        var result = await _serviceMaster.GiangVien.CreateAsync(model);
        return Ok(result);
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdateGiangVienAsync(Guid id, [FromForm] RequestUpdateGiangVienDto model)
    {
        await _serviceMaster.GiangVien.UpdateAsync(id, model);
        return NoContent();
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPut("{id}/update-giang-vien")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> UpdateGiangVienOptionAsync(Guid id,
        [FromForm] RequestUpdateGiangVienOptionDto model)
    {
        await _serviceMaster.GiangVien.UpdateOptionalAsync(id, model);
        return NoContent();
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGiangVienAsync(Guid id)
    {
        await _serviceMaster.GiangVien.DeleteAsync(id);
        return NoContent();
    }
    [Authorize(Policy = "QLKhoa")]
    [HttpPut("change_password")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<ActionResult> ChangePassword([FromForm] RequestChangePasswordDto model)
    {
        await _serviceMaster.TaiKhoan.ChangePassword(model);
        return NoContent();
    }
}