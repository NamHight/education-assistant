using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public interface IRepositoryLopHocPhan
{
    Task<PagedListAsync<LopHocPhan>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);  
    Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(LopHocPhan lopHocPhan);
    void UpdateLopHocPhan(LopHocPhan lopHocPhan);
    void DeleteLopHocPhan(LopHocPhan lopHocPhan);
}
