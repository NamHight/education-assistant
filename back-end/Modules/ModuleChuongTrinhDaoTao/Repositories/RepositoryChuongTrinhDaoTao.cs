using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Repositories;

public class RepositoryChuongTrinhDaoTao : RepositoryBase<ChuongTrinhDaoTao>, IRepositoryChuongTrinhDaoTao
{
    public RepositoryChuongTrinhDaoTao(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(ChuongTrinhDaoTao chuongTrinhDaoTao)
    {
        await Create(chuongTrinhDaoTao);
    }

    public void DeleteChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao)
    {
        Delete(chuongTrinhDaoTao);
    }

    public async Task<PagedListAsync<ChuongTrinhDaoTao>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit,
        string search, string sortBy, string sortByOrder, Guid? nganhId)
    {
        var query = _context.ChuongTrinhDaoTaos!
            .AsNoTracking()
            .AsQueryable();
        if (nganhId != Guid.Empty)
            query = query.Where(item => item.NganhId.Equals(nganhId));
        return await PagedListAsync<ChuongTrinhDaoTao>.ToPagedListAsync(query
                .SearchBy(search, item => item.TenChuongTrinh)
                .Include(item => item.Nganh)
                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<ChuongTrinhDaoTao, object>>>
                {
                    ["tongsotinchi"] = item => item.TongSoTinChi,
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!
                }).AsNoTracking()
            , page, limit);
    }

    public async Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.Nganh)
            .FirstOrDefaultAsync();
    }

    public async Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(int khoa, Guid? nganhId)
    {
        return await FindByCondition(item => item.Khoa == khoa && item.NganhId == nganhId, false).FirstOrDefaultAsync();
    }

    public async Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByMaAsync(string maChuongTrinh, bool trackChanges)
    {
        return await FindByCondition(item => item.MaChuongTrinh == maChuongTrinh, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao)
    {
        Update(chuongTrinhDaoTao);
    }
}