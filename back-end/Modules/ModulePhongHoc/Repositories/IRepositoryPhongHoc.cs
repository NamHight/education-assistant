using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModulePhongHoc.Repositories
{
    public interface IRepositoryPhongHoc
    {
        Task<PagedListAsync<PhongHoc>> GetAllPhongHocAsync(int page, int limit, string search, string sortBy, string sortByOrder, int? loaiPhong, int? trangThai, string? toaNha);
        Task<IEnumerable<PhongHoc>> GetAllPhongHocNoPageAsync();
        Task<List<string>?> GetAllPhongHocByTenPhongsAsync(List<string> tenPhongs);
        Task<List<string>?> GetAllToaNhaAsync();
        Task<PhongHoc?> GetPhongHocByIdAsync(Guid id, bool trackChanges);
        Task CreateAsync(PhongHoc phongHoc);
        void UpdatePhongHoc(PhongHoc phongHoc);
        void DeletePhongHoc(PhongHoc phongHoc);
    }
}
