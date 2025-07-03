using System;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories.DangKyMonHocs;

public interface IRepositoryDangKyMonHoc
{
    Task<DangKyMonHoc?> GetDangKyMonHocBySinhVienIdAndLopHocPhanIdAsync(Guid sinhVienId, Guid lopHocPhanId);
    Task<int> GetCountSinhVienDangKyMonHocAsync(Guid lopHocPhanid);
    Task<DangKyMonHoc?> GetDangKyMonHocBySinhVienAndLopHocPhanAsync(Guid sinhVienId, Guid lopHocPhanId);
    Task CreateAsync(DangKyMonHoc dangKyMonHoc);
    void DeleteDangKyMonHoc(DangKyMonHoc dangKyMonHoc);
}
