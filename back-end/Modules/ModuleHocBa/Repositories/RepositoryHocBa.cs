using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public class RepositoryHocBa : RepositoryBase<HocBa>, IRepositoryHocBa
{
    public RepositoryHocBa(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(HocBa hocBa)
    {
        await Create(hocBa);
    }

    public void DeleteHocBa(HocBa hocBa)
    {
        Delete(hocBa);
    }

    public async Task<PagedListAsync<HocBa>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit)
    {
        return await PagedListAsync<HocBa>.ToPagedListAsync(_context.HocBas!, page, limit);
    }

    public async Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateHocBa(HocBa hocBa)
    {
        Update(hocBa);
    }
}
