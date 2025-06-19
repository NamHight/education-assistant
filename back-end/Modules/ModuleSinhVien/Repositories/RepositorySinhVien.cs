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
    public async Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, Guid? lopId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Include(item => item.LopHoc)
                    .AsQueryable(); 
        if (lopId.HasValue && lopId != Guid.Empty)
        {
            query = query.Where(lh => lh.LopHocId == lopId);
        }
        return await PagedListAsync<SinhVien>.ToPagedListAsync(query.SearchBy(search, item => item.HoTen).SearchBy(search, item => item.MSSV.ToString())
                                                                .IgnoreQueryFilters()
                                                                .OrderBy(item => item.DeletedAt != null)
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!,
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
