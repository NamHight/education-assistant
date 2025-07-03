using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleKhoa.Repositories;

public interface IRepositoryKhoa
{
    Task<PagedListAsync<Khoa>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOder);
    Task<IEnumerable<Khoa>> GetAllKhoaNoPageAsync();  
    Task<Khoa?> GetKhoaByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Khoa khoa);
    void UpdateKhoa(Khoa khoa);
    void DeleteKhoa(Khoa khoa);
}
