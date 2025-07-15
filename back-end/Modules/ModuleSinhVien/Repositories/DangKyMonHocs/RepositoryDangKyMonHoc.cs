using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories.DangKyMonHocs;

public class RepositoryDangKyMonHoc : RepositoryBase<DangKyMonHoc>, IRepositoryDangKyMonHoc
{
    public RepositoryDangKyMonHoc(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(DangKyMonHoc dangKyMonHoc)
    {
        await Create(dangKyMonHoc);
    }

    public void DeleteDangKyMonHoc(DangKyMonHoc dangKyMonHoc)
    {
        Delete(dangKyMonHoc);
    }

    public async Task<int> GetCountSinhVienDangKyMonHocAsync(Guid lopHocPhanid)
    {
        return await _context.DangKyMonHocs!
                    .AsNoTracking()
                    .Where(item => item.LopHocPhanId == lopHocPhanid && item.SinhVien != null)
                    .CountAsync();
    }

    public async Task<DangKyMonHoc?> GetDangKyMonHocBySinhVienAndLopHocPhanAsync(Guid sinhVienId, Guid lopHocPhanId)
    {
        return await FindByCondition(item => item.SinhVienId == sinhVienId && item.LopHocPhanId == lopHocPhanId, false).FirstOrDefaultAsync();
    }

    public async Task<DangKyMonHoc?> GetDangKyMonHocBySinhVienIdAndLopHocPhanIdAsync(Guid sinhVienId, Guid lopHocPhanId)
    {
        return await FindByCondition(item => item.SinhVienId == sinhVienId && item.LopHocPhanId == lopHocPhanId, false).FirstOrDefaultAsync();
    }
}
