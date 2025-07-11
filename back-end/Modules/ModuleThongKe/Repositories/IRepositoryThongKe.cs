using System;
using Education_assistant.Modules.ModuleThongKe.DTOs.Response;
namespace Education_assistant.Modules.ModuleThongKe.Repositories;

public interface IRepositoryThongKe
{
    Task<Dictionary<string, double>> ThongKetTinhTrangHocTap();
    Task<List<ResponseThongKeTrongNamDto>> ThongKetThiLaiTrongNam(int nam);
    Task<List<ResponseThongKeTrongNamDto>> ThongKetQuaMonTrongNam();
    Task<List<ResponseThongKeTopSinhVienDto>> ThongKeTopSinhVienGPAAsync();
}
