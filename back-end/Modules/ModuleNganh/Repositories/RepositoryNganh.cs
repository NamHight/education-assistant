using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleNganh.Repositories;

public class RepositoryNganh : RepositoryBase<Nganh>, IRepositoryNganh
{
    public RepositoryNganh(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(Nganh nganh)
    {
        await Create(nganh);
    }

    public void DeleteNganh(Nganh nganh)
    {
        Delete(nganh);
    }

    public async Task<IEnumerable<Nganh>?> GetAllNganhNoPage()
    {
        return await FindAll(false).Include(item => item.Khoa).Include(item => item.NganhCha).ToListAsync();
    }

    public async Task<PagedListAsync<Nganh>?> GetAllNganhAsync(int page, int limit, string search, string sortBy,
        string sortByOrder)
    {
        return await PagedListAsync<Nganh>.ToPagedListAsync(_context.Nganhs!.SearchBy(search, item => item.TenNganh)
                .Include(item => item.Khoa).Include(item => item.NganhCha)
                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<Nganh, object>>>
                {
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!
                })
            , page, limit);
    }

    public async Task<Nganh?> GetNganhByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.Khoa)
            .Include(item => item.NganhCha).FirstOrDefaultAsync();
    }

    public void UpdateNganh(Nganh nganh)
    {
        Update(nganh);
    }

    public async Task<IEnumerable<Nganh>?> GetALlNganhNoPageNoParentByKhoaIdAsync(Guid khoaId)
    {
        return await FindByCondition(item => item.KhoaId == khoaId && item.NganhChaId.Equals(null), false)
            .Include(item => item.Khoa).Include(item => item.NganhCha).ToListAsync();
    }

    public async Task<IEnumerable<Nganh>?> GetALlNganhByKhoaIdAsync(Guid khoaId)
    {
        return await FindByCondition(item => item.KhoaId == khoaId, false)
            .Include(item => item.Khoa).Include(item => item.NganhCha).ToListAsync();
    }
}