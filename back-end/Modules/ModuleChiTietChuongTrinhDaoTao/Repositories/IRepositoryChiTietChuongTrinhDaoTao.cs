using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Repositories;

public interface IRepositoryChiTietChuongTrinhDaoTao
{
    Task<PagedListAsync<ChiTietChuongTrinhDaoTao>?> GetAllChiTietChuongTrinhDaoTaoAsync(int page, int limit);  
    Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
    void UpdateChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
    void DeleteChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
}
