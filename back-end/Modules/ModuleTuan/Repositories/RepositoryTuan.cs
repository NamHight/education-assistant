using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

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

    public async Task<PagedListAsync<Tuan>> GetAllTuanAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<Tuan>.ToPagedListAsync(_context.Tuans!.SearchBy(search, item => item.SoTuan.ToString())
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

    public void UpdateTuan(Tuan tuan)
    {
        Update(tuan);
    }
}

