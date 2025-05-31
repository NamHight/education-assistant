using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleSinhVienChuongTrinhDaoTaoChuongTrinhDaoTao.Repositories;

public interface IRepositorySinhVienChuongTrinhDaoTao
{
    Task<PagedListAsync<SinhVienChuongTrinhDaoTao>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit);  
    Task<SinhVienChuongTrinhDaoTao?> GetSinhVienChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao);
    void UpdateSinhVienChuongTrinhDaoTao(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao);
    void DeleteSinhVienChuongTrinhDaoTao(SinhVienChuongTrinhDaoTao sinhVienChuongTrinhDaoTao);
}
