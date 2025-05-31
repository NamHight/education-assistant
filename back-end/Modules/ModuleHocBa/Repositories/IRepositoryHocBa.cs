using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public interface IRepositoryHocBa
{
    Task<PagedListAsync<HocBa>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit);  
    Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(HocBa hocBa);
    void UpdateHocBa(HocBa hocBa);
    void DeleteHocBa(HocBa hocBa);
}
