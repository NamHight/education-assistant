using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.AspNetCore.Razor.Language;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public class RepositorySinhVien : RepositoryBase<SinhVien>, IRepositorySinhVien
{
    public RepositorySinhVien(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(SinhVien sinhVien)
    {
        await Create(sinhVien);
    }

    public void DeleteSinhVien(SinhVien sinhVien)
    {
        Delete(sinhVien);
    }
    public async Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<SinhVien>.ToPagedListAsync(_context.SinhViens!.Where(
                                                                    item => item.HoTen.Contains(search) ||
                                                                    item.MSSV.ToString().Contains(search)
                                                                ).Include(item => item.LopHoc)
                                                                .IgnoreQueryFilters()
                                                                .OrderBy(item => item.DeletedAt != null)
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                }).AsNoTracking()
                                                                , page, limit);
    }

    public async Task<PagedListAsync<SinhVien>?> GetAllSinhVienByIdLopAsync(string lopId, int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<SinhVien>.ToPagedListAsync(_context.SinhViens!.SearchBy(lopId, item => item.LopHocId.ToString()!).SearchBy(search, item => item.HoTen).SearchBy(search, item => item.MSSV.ToString()).Include(item => item.LopHoc)
                                                                .IgnoreQueryFilters()
                                                                .OrderBy(item => item.DeletedAt != null)
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                                                                {
                                                                    ["createat"] = item => item.CreatedAt,
                                                                    ["updateat"] = item => item.UpdatedAt!,
                                                                }).AsNoTracking()
                                                                , page, limit);
    }

    public async Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public async Task<SinhVien?> GetSinhVienDeleteAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).IgnoreQueryFilters().FirstOrDefaultAsync();
    }

    public void UpdateSinhVien(SinhVien sinhVien)
    {
        Update(sinhVien);
    }
}
