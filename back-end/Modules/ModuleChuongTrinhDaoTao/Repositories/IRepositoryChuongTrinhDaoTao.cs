using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Repositories;

public interface IRepositoryChuongTrinhDaoTao
{
    Task<PagedListAsync<ChuongTrinhDaoTao>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search,
        string sortBy, string sortByOrder, Guid? nganhId);

    Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByMaAsync(string maChuongTrinh, bool trackChanges);
    Task<ChuongTrinhDaoTao?> GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(int khoa, Guid? nganhId);
    Task CreateAsync(ChuongTrinhDaoTao chuongTrinhDaoTao);
    void UpdateChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao);
    void DeleteChuongTrinhDaoTao(ChuongTrinhDaoTao chuongTrinhDaoTao);
}