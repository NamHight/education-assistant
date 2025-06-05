using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModulePhongHoc.Repositories
{
    public interface IRepositoryPhongHoc
    {
        Task<PagedListAsync<PhongHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);
        Task<PhongHoc?> GetPhongHocByIdAsync(Guid id, bool trackChanges);
        Task CreateAsync(PhongHoc phongHoc);
        void UpdatePhongHoc(PhongHoc phongHoc);
        void DeletePhongHoc(PhongHoc phongHoc);
    }
}
