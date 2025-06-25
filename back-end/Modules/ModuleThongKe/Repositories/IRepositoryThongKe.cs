using System;
using Education_assistant.Modules.ModuleThongKe.Record;

namespace Education_assistant.Modules.ModuleThongKe.Repositories;

public interface IRepositoryThongKe
{
    Task<PassFailPointRaw?> GetPassFailDiemSoAsync(Guid lopHocPhanId);
    Task<List<TopStudentRaw>> GetTopSinhVienLopHocPhanAsync(int khoa, int hocKy);
}
