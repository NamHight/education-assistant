using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public interface IRepositoryLopHocPhan
{
    Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string? search, string? sortBy,
        string? sortByOder, int? khoa, int? loaiChuongTrinh, Guid? chuongTrinhId, int? hocKy, int? trangThai,
        int? loaiLopHoc, Guid? giangVienId);

    Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanByGiangVienAsync(int loaiChuongTrinhDaoTao, int khoa, int hocKy,
        Guid giangVienId);
    Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanByLopHocAndHocKyAsync(int? hocKy, string? maLopHoc, Guid? chuongTrinhDaoTaoId);
    Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanDaNopAsync(int page, int limit, string search, string sortBy, string sortByOrder, int loaiChuongTrinhDaoTao, Guid khoaId, int hocKy);
    Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);

    Task<int> CreateSinhVienLopHocPhanHocBa(Guid maLop, Guid maLhp, Guid maMonHoc, int HocKy);
    
    Task<bool> KiemTraLopHocPhanDaTonTaiAsync(Guid nganhId, int hocKy, int khoa, Guid monHocId);
    Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanNoPageAsync();
    Task CreateAsync(LopHocPhan lopHocPhan);
    void UpdateLopHocPhan(LopHocPhan lopHocPhan);
    void DeleteLopHocPhan(LopHocPhan lopHocPhan);
}