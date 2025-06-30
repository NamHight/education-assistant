using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Exceptions.ThrowError.TuanExceptions;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;

namespace Education_assistant.Modules.ModuleTuan.Repositories;

public class RepositoryTuan : RepositoryBase<Tuan>, IRepositoryTuan
{
    public RepositoryTuan(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(Tuan tuan)
    {
        await Create(tuan);
    }

    public void DeleteTuan(Tuan tuan)
    {
        Delete(tuan);
    }

    public async Task<PagedListAsync<Tuan>> GetAllTuanAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, int? namHoc)
    {
        var query = _context.Tuans!
                        .AsNoTracking()
                        .AsQueryable();

        query = query.Where(t => t.NamHoc == namHoc);
        
        return await PagedListAsync<Tuan>.ToPagedListAsync(query.SearchBy(search, item => item.SoTuan.ToString())
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<Tuan, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                    ["namhoc"] = item => item.NamHoc,
                                                                }).AsNoTracking()
                                                                , page, limit);
    }

    public async Task<Tuan?> GetTuanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Tuan>> GetTuanComboBoxAsync(int namHoc, int? tuanBatDau, Guid giangVienId)
    {
        var query = _context.Tuans!
                    .AsNoTracking()
                    .Where(t => t.NamHoc == namHoc) 
                    .Where(t => !_context.LichBieus!
                            .AsNoTracking()
                            .Any(lb => lb.TuanId == t.Id && lb.LopHocPhan!.GiangVienId == giangVienId)
                    )
                    .OrderBy(item => item.SoTuan)
                    .AsQueryable();
        if (tuanBatDau.HasValue)
        {
            query = query.Where(item => item.SoTuan > tuanBatDau.Value);
        }
        return await query.ToListAsync(); 
    }

    public void UpdateTuan(Tuan tuan)
    {
        Update(tuan);
    }
}

