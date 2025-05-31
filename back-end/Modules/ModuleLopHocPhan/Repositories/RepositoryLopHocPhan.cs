using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public class RepositoryLopHocPhan : RepositoryBase<LopHocPhan>, IRepositoryLopHocPhan
{
    public RepositoryLopHocPhan(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(LopHocPhan lopHocPhan)
    {
        await Create(lopHocPhan);
    }

    public void DeleteLopHocPhan(LopHocPhan lopHocPhan)
    {
        Delete(lopHocPhan);
    }

    public async Task<PagedListAsync<LopHocPhan>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            var lopHocPhans = FindByCondition(item => item.PhongHoc.Contains(search), false);
            return await PagedListAsync<LopHocPhan>.ToPagedListAsync(lopHocPhans, page, limit);
        }
        return await PagedListAsync<LopHocPhan>.ToPagedListAsync(_context.LopHocPhans, page, limit);
    }

    public async Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
       return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateLopHocPhan(LopHocPhan lopHocPhan)
    {
        Update(lopHocPhan);
    }
}
