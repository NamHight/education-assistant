using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModulePhongHoc.Repositories;

public class RepositoryPhongHoc : RepositoryBase<PhongHoc>, IRepositoryPhongHoc
{
    public RepositoryPhongHoc(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(PhongHoc phongHoc)
    {
        await Create(phongHoc);
    }

    public void DeletePhongHoc(PhongHoc phongHoc)
    {
        Delete(phongHoc);
    }

    public async Task<PagedListAsync<PhongHoc>> GetAllPhongHocAsync(int page, int limit, string search, string sortBy,
        string sortByOrder, int? loaiPhong, int? trangThai, string? toaNha)
    {
        var query = _context.PhongHocs!
            .AsNoTracking()
            .SearchBy(search, item => item.TenPhong)
            .AsQueryable();
        if (!string.IsNullOrEmpty(toaNha)) query = query.Where(item => item.ToaNha.ToUpper() == toaNha.ToUpper());
        if (loaiPhong.HasValue && loaiPhong != 0) query = query.Where(item => item.LoaiPhongHoc == loaiPhong);
        if (trangThai.HasValue && trangThai != 0) query = query.Where(item => item.TrangThaiPhongHoc == trangThai);
        return await PagedListAsync<PhongHoc>.ToPagedListAsync(query
            .OrderBy(item => item.TrangThaiPhongHoc == (int)TrangThaiPhongHocEnum.BAO_TRI)
            .ThenBy(item => item.TrangThaiPhongHoc == (int)TrangThaiPhongHocEnum.KHONG_SU_DUNG)
            .ThenByDescending(item => item.TrangThaiPhongHoc == (int)TrangThaiPhongHocEnum.HOAT_DONG)
            .ThenByDescending(item => item.CreatedAt), page, limit);
    }

    public async Task<List<string>?> GetAllPhongHocByTenPhongsAsync(List<string> tenPhongs)
    {
        return await _context.PhongHocs!.AsNoTracking().Where(p => tenPhongs.Contains(p.TenPhong.ToUpper()))
            .Select(item => item.TenPhong.ToUpper()).ToListAsync();
    }

    public async Task<IEnumerable<PhongHoc>> GetAllPhongHocNoPageAsync()
    {
        return await FindByCondition(item => item.TrangThaiPhongHoc == (int)TrangThaiPhongHocEnum.HOAT_DONG, false)
            .ToListAsync();
    }

    public async Task<List<string>?> GetAllToaNhaAsync()
    {
        return await _context.PhongHocs!.Where(p => !string.IsNullOrEmpty(p.ToaNha))
            .Select(p => p.ToaNha.Trim())
            .Distinct().OrderBy(p => p)
            .ToListAsync();
    }

    public async Task<PhongHoc?> GetPhongHocByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdatePhongHoc(PhongHoc phongHoc)
    {
        Update(phongHoc);
    }
}