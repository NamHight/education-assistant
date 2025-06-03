using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleDangKyMonHoc.Repositories;

public interface IRepositoryDangKyMonHoc
{
    Task<PagedListAsync<DangKyMonHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit);  
    Task<DangKyMonHoc?> GetDangKyMonHocByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(DangKyMonHoc dangKyMonHoc);
    void UpdateDangKyMonHoc(DangKyMonHoc dangKyMonHoc);
    void DeleteDangKyMonHoc(DangKyMonHoc dangKyMonHoc);
}
