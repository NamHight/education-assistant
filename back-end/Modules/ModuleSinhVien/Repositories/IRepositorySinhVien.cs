using Education_assistant.Models;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public interface IRepositorySinhVien
{
    Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string? search, string? sortBy,
        string? sortByOrder, Guid? lopId, int? tinhTrangHocTap, int? trangThai);

    Task<IEnumerable<SinhVien>> GetAllSinhVienByLopHoc(Guid lopHocId);
    Task<int> GetAllTongSoAsync(Guid? lopHocId);
    Task<int> GetAllSoXuatSacAsync(Guid? lopHocId);
    Task<int> GetAllSoKhaAsync(Guid? lopHocId);
    Task<int> GetAllSoCanCaiThienAsync(Guid? lopHocId);
    Task<int> GetAllSoDangHocAsync(Guid? lopHocId);
    Task<int> GetAllSoDaTotNghiepAsync(Guid? lopHocId);
    Task<int> GetAllBuocThoiHocAsync(Guid? lopHocId);
    Task<List<ResponseExportFileSinhVienDto>> GetAllSinhVienExportFileAsync(Guid lopHocId);
    Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges);
    Task<SinhVien?> GetSinhVienByMssvAsync(string mssv, bool trackChanges);
    Task<List<SinhVien>> GetAllSinhVienByIds(List<Guid> ids, bool trackChanges);
    Task<SinhVien?> GetSinhVienByMssvOrCccdAsync(string mssv, string cccd);

    Task<PagedListAsync<SinhVien>> GetAllSinhVienByLopHocPhanIdAsync(int page, int limit, string? search,
        string? sortBy, string? sortByOrder, Guid lopHocPhanId);

    Task CreateAsync(SinhVien sinhVien);
    void UpdateSinhVien(SinhVien sinhVien);
    void DeleteSinhVien(SinhVien sinhVien);
    Task<SinhVien?> GetSinhVienDeleteAsync(Guid id, bool trackChanges);
}