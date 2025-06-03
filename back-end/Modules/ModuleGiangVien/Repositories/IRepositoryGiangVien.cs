using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories;

public interface IRepositoryGiangVien
{
    Task<PagedListAsync<GiangVien>?> GetAllGiangVienAsync(int page, int limit, string search, string sortBy, string sortByOrder);  
    Task<GiangVien?> GetGiangVienByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(GiangVien giangVien);
    void UpdateGiangVien(GiangVien giangVien);
    void DeleteGiangVien(GiangVien giangVien);
}