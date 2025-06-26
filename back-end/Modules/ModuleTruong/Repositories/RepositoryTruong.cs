using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;
using Education_assistant.Extensions;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public class RepositoryTruong : RepositoryBase<Truong>, IRepositoryTruong
{
    public RepositoryTruong(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(Truong truong)
    {
        await Create(truong);
    }

    public void DeleteTruong(Truong truong)
    {
        Delete(truong);
    }

    public async Task<PagedListAsync<Truong>> GetAllTruongAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder)
    {
        return await PagedListAsync<Truong>.ToPagedListAsync(_context.Truongs!.SearchBy(search, item => item.Key)
                                    .SortByOptions(sortBy, sortByOrder, new Dictionary<string, System.Linq.Expressions.Expression<Func<Truong, object>>>
                                    {
                                        ["createdat"] = item => item.CreatedAt,
                                        ["updatedat"] = item => item.UpdatedAt!
                                    }).AsNoTracking(),
                                    page, limit);
    }

    public async Task<Dictionary<string, string>> GetTruongAsync(bool trackChanges)
    {
        return await FindAll(trackChanges).ToDictionaryAsync(e => e.Key, e => e.Value);
    }

    public async Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public async Task<Truong?> GetTruongByKeyAsync(string key, bool trackChanges)
    {
        return await FindByCondition(item => item.Key == key, false).FirstOrDefaultAsync();
    }

    public void UpdateTruong(Truong truong)
    {
        Update(truong);
    }
}