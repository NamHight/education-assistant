using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using Education_assistant.Extensions;
namespace Education_assistant.Modules.ModuleMonHoc.Repositories;

public class RepositoryMonHoc : RepositoryBase<MonHoc>, IRepositoryMonHoc
{
    public RepositoryMonHoc(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(MonHoc monHoc)
    {
        await Create(monHoc);
    }

    public void DeleteMonHoc(MonHoc monHoc)
    {
        Delete(monHoc);
    }

    public async Task<PagedListAsync<MonHoc>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<MonHoc>.ToPagedListAsync(_context.MonHocs!.SearchBy(search, item => item.TenMonHoc).Include(item => item.Khoa)
                                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, System.Linq.Expressions.Expression<Func<MonHoc, object>>>
                                                                                {
                                                                                    ["createdat"] = item => item.CreatedAt,
                                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                                    ["deletedat"] = item => item.DeletedAt!
                                                                                })
                                                                                , page, limit);
    }

    public async Task<MonHoc?> GetMonHocByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.Khoa).FirstOrDefaultAsync();
    }


    public void UpdateMonHoc(MonHoc monHoc)
    {
        Update(monHoc);
    }

    public async Task<List<MonHoc>> GetMonHocByKhoaIdAsync(Guid khoaId, bool trackChanges)
    {
        return await FindByCondition(item => item.KhoaId == khoaId, trackChanges)
         .Include(item => item.Khoa)
         .ToListAsync();
    }
}
