using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTuan.Repositories;

public interface IRepositoryTuan
{
    Task<PagedListAsync<Tuan>> GetAllTuanAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, int? namHoc);
    Task<IEnumerable<Tuan>> GetALLTuanByNamHocAsync(int namHoc);
    Task<IEnumerable<Tuan>> GetTuanComboBoxAsync(int namHoc, int? tuanBatDau);
    Task<IEnumerable<Tuan>> GetTuanCopyAsync(int namHoc,Guid vaoTuanId, Guid denTuanId, Guid giangVienId);
    Task<IEnumerable<Tuan>> GetTuanCopyByLopHocPhanIdAsync(int namHoc,Guid vaoTuanId, Guid denTuanId, List<Guid> lopHocPhanIds);

    Task<bool> HasTuanForNamHocAsync(int namHoc);
    Task<Tuan?> GetTuanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Tuan tuan);
    void UpdateTuan(Tuan tuan);
    void DeleteTuan(Tuan tuan);
}
