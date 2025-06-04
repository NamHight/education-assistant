using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;

public class RepositoryChiTietLopHocPhan : RepositoryBase<ChiTietLopHocPhan>, IRepositoryChiTietLopHocPhan
{
    public RepositoryChiTietLopHocPhan(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        await Create(chiTietLopHocPhan);
    }

    public void DeleteChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        Delete(chiTietLopHocPhan);
    }

    public async Task<PagedListAsync<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder)
    {
        return await PagedListAsync<ChiTietLopHocPhan>.ToPagedListAsync(_context.ChiTietLopHocPhans!
                                                                , page, limit);
    }

    public async Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        Update(chiTietLopHocPhan);
    }
}
