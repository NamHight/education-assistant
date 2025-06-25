using System;
using Education_assistant.Modules.ModuleThongKe.DTOs.Param;
using Education_assistant.Modules.ModuleThongKe.DTOs.Response;

namespace Education_assistant.Modules.ModuleThongKe.Services;

public interface IServiceThongKe
{
    Task<ResponsePassFailPointClassDto?> GetPassFailDiemSoAsync(ParamCountPointThongKeDto paramCountPointThongKeDto);
    Task<List<ResponseTopStudentRawDto>> GetTopSinhVienLopHocPhanAsync(ParamTopStudentByClassThongKeDDto paramTopStudentByClassThongKeDDto);
}
