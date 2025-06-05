using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLopHoc.Repositories;

public class RepositoryLopHoc : RepositoryBase<LopHoc>, IRepositoryLopHoc
{
    public RepositoryLopHoc(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(LopHoc lopHoc)
    {
        await Create(lopHoc);
    }

    public void DeleteLopHoc(LopHoc lopHoc)
    {
        Delete(lopHoc);
    }

    public async Task<PagedListAsync<LopHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            var lopHocs = FindByCondition(item => item.MaLopHoc.Contains(search), false);
            return await PagedListAsync<LopHoc>.ToPagedListAsync(lopHocs, page, limit);
        }
        return await PagedListAsync<LopHoc>.ToPagedListAsync(_context.LopHocs!, page, limit);
    }

    public async Task<LopHoc?> GetLopHocByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateLopHoc(LopHoc lopHoc)
    {
        Update(lopHoc);
    }
}
