using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.AspNetCore.Razor.Language;
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

    public async Task<PagedListAsync<ChuongTrinhDaoTao>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<ChuongTrinhDaoTao>.ToPagedListAsync(_context.ChuongTrinhDaoTaos!.SearchBy(search, item => item.TenChuongTrinh).Include(item => item.Nganh)
                                                    .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<ChuongTrinhDaoTao, object>>>
                                                    {
                                                        ["hocphi"] = item => item.HocPhi,
                                                        ["tongsotinchi"] = item => item.TongSoTinChi,
                                                        ["createdat"] = item => item.CreatedAt,
                                                        ["updatedat"] = item => item.UpdatedAt!,
                                                    }).AsNoTracking()
                                                    , page, limit);
    }

    public async Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
       return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.Nganh).FirstOrDefaultAsync();
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
