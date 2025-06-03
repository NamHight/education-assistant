using System;
using Education_assistant.Context;
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

    public async Task<PagedListAsync<ChiTietChuongTrinhDaoTao>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit)
    {
        return await PagedListAsync<ChiTietChuongTrinhDaoTao>.ToPagedListAsync(_context.ChiTietChuongTrinhDaoTaos, page, limit);
    }

    public async Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao)
    {
        Update(chiTietChuongTrinhDaoTao);
    }
}
