using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleKhoa.Repositories;

public class RepositoryKhoa : RepositoryBase<Khoa>, IRepositoryKhoa
{
    public RepositoryKhoa(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(Khoa khoa)
    {
        await Create(khoa);
    }

    public void DeleteKhoa(Khoa khoa)
    {
        Delete(khoa);
    }

    public async Task<PagedListAsync<Khoa>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search,
        string sortBy, string sortByOder)
    {
        Console.WriteLine($"Search 999999999999999999999: {search}, SortBy: {sortBy}, SortByOrder: {sortByOder}");
        return await PagedListAsync<Khoa>.ToPagedListAsync(_context.Khoas!.SearchBy(search, item => item.TenKhoa)
                .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<Khoa, object>>>
                {
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!
                }).AsNoTracking()
            , page, limit);
    }

    public async Task<Khoa?> GetKhoaByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateKhoa(Khoa khoa)
    {
        Update(khoa);
    }
}