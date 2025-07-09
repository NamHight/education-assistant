using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Repositories;

public interface IRepositoryChiTietChuongTrinhDaoTao
{
    Task<PagedListAsync<ChiTietChuongTrinhDaoTao>?> GetAllChiTietChuongTrinhDaoTaoAsync(int page, int limit,
        string search, string sortBy, string sortByOder, Guid? chuongTrinhDaoTaoId);

    Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task<ChiTietChuongTrinhDaoTao?> GetCtctdtByCtctAndMonHocAsync(Guid chuongTrinhId, Guid monHocId);
    Task<ChiTietChuongTrinhDaoTao?> GetCtctdtByIdsCtctdtAndMonHocAsync(List<Guid> chuongTrinhId, Guid monHocId);

    Task<IEnumerable<ChiTietChuongTrinhDaoTao>> GetChiTietChuongTrinhDaoTaoByHocKyAndChuongTrinhId(int hocKy,
        Guid chuongTrinhId);

    Task<ChiTietChuongTrinhDaoTao?> GetChiTietChuongTrinhDaoTaoByMonHocIdAndChuongTrinhId(Guid monHocId,
        Guid chuongTrinhDaoTaoId);

    Task<List<Guid>?> GetAllIdChiTietChuongTrinhDaoTaoByChuongTrinhDaoTaoIdAsync(Guid chuongTrinhDaoTaoId);

    Task<IEnumerable<ChiTietChuongTrinhDaoTao>?> GetAllCtctdtByCtdtIdAsync(Guid id, int? hocKy = null);
    Task CreateAsync(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
    void UpdateChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
    void DeleteChiTietChuongTrinhDaoTao(ChiTietChuongTrinhDaoTao chiTietChuongTrinhDaoTao);
}