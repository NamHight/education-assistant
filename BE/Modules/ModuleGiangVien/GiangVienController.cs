using Education_assistant.Services.ServiceMaster;
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
    public async Task<IActionResult> GetGiangViens()
    {
        try
        {
            var giangViens = await _serviceMaster.GiangVien.GetAllAsync(false);
            return Ok(giangViens);
        }
        catch
        {
            return StatusCode(500, "Internal server error");
        }
    }
}