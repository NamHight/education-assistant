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
        [HttpGet("diem-lop-hoc-phan")]
        public async Task<ActionResult> GetAllKhoaAsync([FromQuery] ParamCountPointThongKeDto paramCountPointThongKeDto)
        {
            var result = await _serviceMaster.ThongKe.GetPassFailDiemSoAsync(paramCountPointThongKeDto);
            return Ok(result);
        }
        [HttpGet("dssvien-gioi-nhat")]
        public async Task<ActionResult> GetAllKhoaAsync([FromQuery] ParamTopStudentByClassThongKeDDto paramTopStudentByClassThongKeDDto)
        {
            var result = await _serviceMaster.ThongKe.GetTopSinhVienLopHocPhanAsync(paramTopStudentByClassThongKeDDto);
            return Ok(result);
        }
    }
}
