using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleMonHoc.Repositories;

public interface IRepositoryMonHoc
{
    Task<PagedListAsync<MonHoc>?> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search, string sortBy, string sortByOder);  
    Task<MonHoc?> GetMonHocByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(MonHoc monHoc);
    void UpdateMonHoc(MonHoc monHoc);
    void DeleteMonHoc(MonHoc monHoc);
}
