using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories.TaiKhoans;

public interface IRepositoryTaiKhoan
{
    Task<PagedListAsync<TaiKhoan>?> GetAllTaiKhoanAsync(int page, int limit, string search, string sortBy,
        string sortByOder);

    Task<TaiKhoan?> GetTaiKhoanByIdAsync(Guid id, bool trackChanges);
    Task<TaiKhoan?> GetTaiKhoanByEmailAsync(string email, bool trackChanges);
    Task CreateAsync(TaiKhoan taiKhoan);
    void UpdateTaiKhoan(TaiKhoan taiKhoan);
    void DeleteTaiKhoan(TaiKhoan taiKhoan);
}