using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleSinhVienChuongTrinhDaoTaoChuongTrinhDaoTao.Repositories;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVienChuongTrinhDaoTao.Repositories;

public class RepositorySinhVienChuongTrinhDaoTao : RepositoryBase<SinhVienChuongTrinhDaoTao>, IRepositorySinhVienChuongTrinhDaoTao
{
    public RepositorySinhVienChuongTrinhDaoTao(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao)
    {
        await Create(sinhVienChuongTrinhDaoTao);
    }

    public void DeleteSinhVienChuongTrinhDaoTao(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao)
    {
        Delete(sinhVienChuongTrinhDaoTao);
    }

    public async Task<PagedListAsync<SinhVienChuongTrinhDaoTao>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit)
    {
        return await PagedListAsync<SinhVienChuongTrinhDaoTao>.ToPagedListAsync(_context.SinhVienChuongTrinhDaoTaos!, page, limit);
    }

    public async Task<SinhVienChuongTrinhDaoTao?> GetSinhVienChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateSinhVienChuongTrinhDaoTao(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao)
    {
        Update(sinhVienChuongTrinhDaoTao);
    }
}
