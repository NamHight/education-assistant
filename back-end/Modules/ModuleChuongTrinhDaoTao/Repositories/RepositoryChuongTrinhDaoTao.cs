using System;
using Education_assistant.Context;
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

    public async Task<PagedListAsync<ChuongTrinhDaoTao>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            var chuongTrinhDaoTaos = FindByCondition(item => item.TenChuongTrinh.Contains(search), false);
            return await PagedListAsync<ChuongTrinhDaoTao>.ToPagedListAsync(chuongTrinhDaoTaos, page, limit);
        }
        return await PagedListAsync<ChuongTrinhDaoTao>.ToPagedListAsync(_context.ChuongTrinhDaoTaos, page, limit);
    }

    public async Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
       return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao)
    {
        Update(chuongTrinhDaoTao);
    }
}
