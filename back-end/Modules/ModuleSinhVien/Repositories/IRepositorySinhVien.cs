using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public interface IRepositorySinhVien
{
    Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string search, string sortBy, string sortByOrder);  
    Task<PagedListAsync<SinhVien>?> GetAllSinhVienByIdLopAsync(Guid lopId, int page, int limit, string search, string sortBy, string sortByOrder);  
    Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(SinhVien sinhVien);
    void UpdateSinhVien(SinhVien sinhVien);
    void DeleteSinhVien(SinhVien sinhVien);
    Task<SinhVien?> GetSinhVienDeleteAsync(Guid id, bool trackChanges); 
}
