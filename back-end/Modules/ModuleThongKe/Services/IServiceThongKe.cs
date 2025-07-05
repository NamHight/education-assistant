using System;
using Education_assistant.Modules.ModuleThongKe.DTOs.Param;
using Education_assistant.Modules.ModuleThongKe.DTOs.Response;

namespace Education_assistant.Modules.ModuleThongKe.Services;

public interface IServiceThongKe
{
    Task<Dictionary<string, double>> ThongKetTinhTrangHocTap();
    Task<List<ResponseThongKeTrongNamDto>> ThongKetThiLaiTrongNam();
    Task<List<ResponseThongKeTrongNamDto>> ThongKetQuaMonTrongNam();
    Task<List<ResponseThongKeTopSinhVienDto>> ThongKeTopSinhVienGPAAsync();
}
