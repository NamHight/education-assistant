using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Repositories;

public interface IRepositoryChuongTrinhDaoTao
{
    Task<PagedListAsync<ChuongTrinhDaoTao>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);  
    Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(ChuongTrinhDaoTao chuongTrinhDaoTao);
    void UpdateChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao);
    void DeleteChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao);
}
