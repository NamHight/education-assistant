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
        var query = _context.ChiTietChuongTrinhDaoTaos!
                                .AsNoTracking()
                                .Include(item => item.MonHoc)
                                .Include(item => item.ChuongTrinhDaoTao)
                                .Include(item => item.BoMon)
                                .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) {
            query = query.SearchBy(search, item => item.ChuongTrinhDaoTao!.TenChuongTrinh);
        }
        return await PagedListAsync<ChiTietChuongTrinhDaoTao>.ToPagedListAsync(query
                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<ChiTietChuongTrinhDaoTao, object>>>
                                {
                                    ["createdat"] = item => item.CreatedAt,
                                    ["updatedat"] = item => item.UpdatedAt!,
                                    ["sotinchi"] = item => item.SoTinChi!,
                                    ["hocky"] = item => item.HocKy,
                                    ["loaimonhoc"] = item => item.LoaiMonHoc!,
                                 }).AsNoTracking(), page, limit);
    }

    public async Task<IEnumerable<ChiTietChuongTrinhDaoTao>?> GetAllCtctdtByCtdtIdAsync(Guid id, int hocKy)
    {
        return await _context.ChiTietChuongTrinhDaoTaos?.Where(item => item.ChuongTrinhDaoTaoId == id && item.HocKy == hocKy).AsNoTracking().ToListAsync()!;
    }

    public async Task<IEnumerable<ChiTietChuongTrinhDaoTao>> GetChiTietChuongTrinhDaoTaoByHocKyAndChuongTrinhId(int hocKy, Guid chuongTrinhId)
    {
        return await FindAll(false).Where(item => item.ChuongTrinhDaoTaoId == chuongTrinhId && item.HocKy == hocKy).Include(item => item.MonHoc).ToListAsync();
    }

    public async Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges)
                                .Include(item => item.MonHoc)
                                .Include(item => item.ChuongTrinhDaoTao)
                                .Include(item => item.BoMon).FirstOrDefaultAsync();
    }

    public async Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByMonHocIdAndChuongTrinhId(Guid monHocId, Guid chuongTrinhDaoTaoId)
    {
        return await FindByCondition(item => item.MonHocId == monHocId && item.ChuongTrinhDaoTaoId == chuongTrinhDaoTaoId, false).FirstOrDefaultAsync();
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
