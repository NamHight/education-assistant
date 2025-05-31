using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTaiKhoan.Repositories;

public interface IRepositoryTaiKhoan
{
    Task<PagedListAsync<TaiKhoan>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);  
    Task<TaiKhoan?> GetTaiKhoanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(TaiKhoan taiKhoan);
    void UpdateTaiKhoan(TaiKhoan taiKhoan);
    void DeleteTaiKhoan(TaiKhoan taiKhoan);
}
