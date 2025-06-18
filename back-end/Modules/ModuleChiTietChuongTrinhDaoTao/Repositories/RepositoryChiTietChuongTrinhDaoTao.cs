using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Repositories;

public class RepositoryChiTietChuongTrinhDaoTao : RepositoryBase<ChiTietChuongTrinhDaoTao>, IRepositoryChiTietChuongTrinhDaoTao
{
    public RepositoryChiTietChuongTrinhDaoTao(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao)
    {
        await Create(chiTietChuongTrinhDaoTao);
    }

    public void DeleteChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao)
    {
        Delete(chiTietChuongTrinhDaoTao);
    }

    public async Task<PagedListAsync<ChiTietChuongTrinhDaoTao>?> GetAllChiTietChuongTrinhDaoTaoAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<ChiTietChuongTrinhDaoTao>.ToPagedListAsync(_context.ChiTietChuongTrinhDaoTaos!.Include(item => item.MonHoc).Include(item => item.ChuongTrinhDaoTao).Include(item => item.BoMon)
                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<ChiTietChuongTrinhDaoTao, object>>>
                                {
                                    ["createdat"] = item => item.CreatedAt,
                                    ["updatedat"] = item => item.UpdatedAt!,
                                    ["sotinchi"] = item => item.SoTinChi!,
                                }).AsNoTracking(), page, limit);
    }

    public async Task<IEnumerable<ChiTietChuongTrinhDaoTao>?> GetAllCtctdtByCtdtIdAsync(Guid id, int hocKy)
    {
        return await _context.ChiTietChuongTrinhDaoTaos?.Where(item => item.ChuongTrinhDaoTaoId == id && item.HocKy == hocKy).AsNoTracking().ToListAsync()!;
    }

    public async Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public async Task<ChiTietChuongTrinhDaoTao?> GetCtctdtByCtctAndMonHocAsync(Guid chuongTrinhId, Guid monHocId)
    {
        return await FindByCondition(item => item.ChuongTrinhDaoTaoId == chuongTrinhId && item.MonHocId == monHocId, false).FirstOrDefaultAsync();
    }

    public void UpdateChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao)
    {
        Update(chiTietChuongTrinhDaoTao);
    }
}
