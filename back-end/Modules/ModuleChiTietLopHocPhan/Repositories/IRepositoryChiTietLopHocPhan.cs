using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;

public interface IRepositoryChiTietLopHocPhan
{
    Task<PagedListAsync<ChiTietLopHocPhan>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit);  
    Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(ChiTietLopHocPhan chiTietLopHocPhan);
    void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
    void DeleteChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
}
