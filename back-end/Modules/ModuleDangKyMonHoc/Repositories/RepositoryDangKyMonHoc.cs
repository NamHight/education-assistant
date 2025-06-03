using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleDangKyMonHoc.Repositories;

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

    public async Task<PagedListAsync<DangKyMonHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit)
    {
        return await PagedListAsync<DangKyMonHoc>.ToPagedListAsync(_context.DangKyMonHocs!, page, limit);
    }

    public async Task<DangKyMonHoc?> GetDangKyMonHocByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateDangKyMonHoc(DangKyMonHoc dangKyMonHoc)
    {
        Update(dangKyMonHoc);
    }
}
