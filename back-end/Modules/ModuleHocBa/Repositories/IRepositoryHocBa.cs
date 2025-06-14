using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public interface IRepositoryHocBa
{
    Task<PagedListAsync<HocBa>> GetAllHocBaAsync(int page, int limit, string search, string sortBy, string sortByOrder);  
    Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges);
    Task<IEnumerable<HocBa>> GetAllHocBaByIdAsync(List<Guid> ids);
    Task CreateAsync(HocBa hocBa);
    void UpdateHocBa(HocBa hocBa);
    void DeleteHocBa(HocBa hocBa);
}
