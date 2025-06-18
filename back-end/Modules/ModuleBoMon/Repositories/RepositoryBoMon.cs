using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleBoMon.Repositories;

public class RepositoryBoMon : RepositoryBase<BoMon>, IRepositoryBoMon
{
    public RepositoryBoMon(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(BoMon boMon)
    {
        await Create(boMon);
    }

    public void DeleteBoMon(BoMon boMon)
    {
        Delete(boMon);
    }

    public async Task<PagedListAsync<BoMon>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<BoMon>.ToPagedListAsync(_context.BoMons!.SearchBy(search, item => item.TenBoMon).Include(item => item.Khoa)
                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<BoMon, object>>>
                                {
                                    ["createdat"] = item => item.CreatedAt,
                                    ["updatedat"] = item => item.UpdatedAt!,
                                }).AsNoTracking(), page, limit);
    }

    public async Task<BoMon?> GetBoMonByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateBoMon(BoMon boMon)
    {
        Update(boMon);
    }
}
