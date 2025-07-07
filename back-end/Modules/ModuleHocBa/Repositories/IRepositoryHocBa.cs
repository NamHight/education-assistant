using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public interface IRepositoryHocBa
{
    Task<PagedListAsync<HocBa>> GetAllHocBaAsync(int page, int limit, string search, string sortBy, string sortByOrder,
        Guid? lopHocPhanId);

    Task<IEnumerable<HocBa>> GetAllHocBaByKeysAsync(List<Guid> sinhVienIds, Guid ctctdtId);
    Task<HocBa?> GetHocBaBySinhVienAndLopHocPhanAsync(Guid sinhVienId, Guid lopHocPhanId);
    Task<decimal?> TinhGPAAsync(Guid sinhVienId);
    Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges);
    Task<HocBa?> GetHocBaByLopHocPhanIdAsync(Guid lopHocPhanId);
    Task<IEnumerable<HocBa>> GetAllHocBaByIdAsync(List<Guid> ids);
    Task CreateAsync(HocBa hocBa);
    void UpdateHocBa(HocBa hocBa);
    void DeleteHocBa(HocBa hocBa);
}