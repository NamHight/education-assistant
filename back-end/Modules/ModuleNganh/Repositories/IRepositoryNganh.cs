using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleNganh.Repositories;

public interface IRepositoryNganh
{
    Task<PagedListAsync<Nganh>?>
        GetAllNganhAsync(int page, int limit, string search, string sortBy, string sortByOrder);

    Task<Nganh?> GetNganhByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Nganh nganh);
    void UpdateNganh(Nganh nganh);
    void DeleteNganh(Nganh nganh);
    Task<IEnumerable<Nganh>?> GetAllNganhNoPage();

    Task<IEnumerable<Nganh>?> GetALlNganhNoPageNoParentByKhoaIdAsync(Guid khoaId);
    Task<IEnumerable<Nganh>?> GetALlNganhByKhoaIdAsync(Guid khoaId);
}