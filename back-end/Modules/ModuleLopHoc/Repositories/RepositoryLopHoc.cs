using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
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

    public async Task<PagedListAsync<LopHoc>> GetAllLopHocAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<LopHoc>.ToPagedListAsync(_context.LopHocs!.SearchBy(search, item => item.MaLopHoc).Include(item => item.GiangVien).Include(item => item.Nganh)
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<LopHoc, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                    ["siso"] = item => item.SiSo
                                                                }).AsNoTracking(), page, limit);
    }

    public async Task<LopHoc?> GetLopHocByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.GiangVien).Include(item => item.Nganh).FirstOrDefaultAsync();
    }

    public void UpdateLopHoc(LopHoc lopHoc)
    {
        Update(lopHoc);
    }
}
