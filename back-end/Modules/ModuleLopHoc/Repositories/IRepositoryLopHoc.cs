using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHoc.Repositories;

public interface IRepositoryLopHoc
{
    Task<PagedListAsync<LopHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);  
    Task<LopHoc?> GetLopHocByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(LopHoc lopHoc);
    void UpdateLopHoc(LopHoc lopHoc);
    void DeleteLopHoc(LopHoc lopHoc);
}
