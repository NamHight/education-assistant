using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleBoMon.Repositories;

public interface IRepositoryBoMon
{
    Task<PagedListAsync<BoMon>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOrder);
    Task<IEnumerable<BoMon>> GetAllBoMonNoPageAsync(); 
    Task<BoMon?> GetBoMonByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(BoMon boMon);
    void UpdateBoMon(BoMon boMon);
    void DeleteBoMon(BoMon boMon);
    Task<List<BoMon>> GetBoMonByKhoaIdAsync(Guid khoaId, bool trackChanges);

}
