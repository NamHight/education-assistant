using Education_assistant.Modules.ModuleThongKe.DTOs.Param;
using Education_assistant.Services.ServiceMaster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleThongKe
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GiangVien")]
    public class ThongKeController : ControllerBase
    {
        private readonly IServiceMaster _serviceMaster;

        public ThongKeController(IServiceMaster serviceMaster)
        {
            _serviceMaster = serviceMaster;
        }
        [HttpGet("xep-loai-hoc-luc")]
        public async Task<ActionResult> GetThongKeTinhTrangHocTapAsync()
        {
            var result = await _serviceMaster.ThongKe.ThongKetTinhTrangHocTap();
            return Ok(result);
        }
        [HttpGet("top-sinh-vien-gpa")]
        public async Task<ActionResult> GetThongKeTopSinhVienGPAAsync()
        {
            var result = await _serviceMaster.ThongKe.ThongKeTopSinhVienGPAAsync();
            return Ok(result);
        }
        [HttpGet("thi-lai-trong-nam")]
        public async Task<ActionResult> GetThongKeThiLaiTrongNamAsync([FromQuery] int nam)
        {
            var result = await _serviceMaster.ThongKe.ThongKetThiLaiTrongNam(nam);
            return Ok(result);
        }
        [HttpGet("qua-mon-trong-nam")]
        public async Task<ActionResult> GetThongKeQuaMonTrongNamAsync()
        {
            var result = await _serviceMaster.ThongKe.ThongKetQuaMonTrongNam();
            return Ok(result);
        }
    }
}
