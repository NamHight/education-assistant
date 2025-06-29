using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public interface IRepositoryLopHocPhan
{
    Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string? search, string? sortBy, string? sortByOder, int? khoa, int? loaiChuongTrinh, Guid? chuongTrinhId, int? hocKy, int? trangThai, int? loaiLopHoc, Guid? giangVienId);
    Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanByGiangVienAsync(int loaiChuongTrinhDaoTao, int khoa, int hocKy, Guid giangVienId);
    Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<int> CreateSinhVienLopHocPhanHocBa(Guid maLop, Guid maLhp, Guid? maGiangVien, Guid maMonHoc, Guid maCtctdt, int HocKy);
    Task<bool> KiemTraLopHocPhanDaTonTaiAsync(Guid nganhId, int hocKy, int khoa, Guid monHocId);
    Task CreateAsync(LopHocPhan lopHocPhan);
    void UpdateLopHocPhan(LopHocPhan lopHocPhan);
    void DeleteLopHocPhan(LopHocPhan lopHocPhan);
}