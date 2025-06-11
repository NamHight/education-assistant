using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public interface IRepositoryLopHocPhan
{
    Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string search, string sortBy,
        string sortByOder);

    Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<int> CreateSinhVienLopHocPhan(Guid maLop, Guid maLhp, Guid? maGiangVien, Guid maMonHoc, int HocKy);
    Task CreateAsync(LopHocPhan lopHocPhan);
    void UpdateLopHocPhan(LopHocPhan lopHocPhan);
    void DeleteLopHocPhan(LopHocPhan lopHocPhan);
}