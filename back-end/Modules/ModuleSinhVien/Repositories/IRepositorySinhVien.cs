using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public interface IRepositorySinhVien
{
    Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, Guid? lopId, int? tinhTrangHocTap);
    Task<IEnumerable<SinhVien>> GetAllSinhVienByLopHoc(Guid lopHocId);
    Task<int> GetAllTongSoAsync(Guid? lopHocId);
    Task<int> GetAllSoXuatSacAsync(Guid? lopHocId);
    Task<int> GetAllSoKhaAsync(Guid? lopHocId);
    Task<int> GetAllSoCanCaiThienAsync(Guid? lopHocId);
    Task<int> GetAllSoDangHocAsync(Guid? lopHocId);
    Task<int> GetAllSoDaTotNghiepAsync(Guid? lopHocId);
    Task<int> GetAllSoTamNghiAsync(Guid? lopHocId);
    Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges);
    Task<SinhVien?> GetSinhVienByMssvOrCccdAsync(string mssv, string cccd);
    Task CreateAsync(SinhVien sinhVien);
    void UpdateSinhVien(SinhVien sinhVien);
    void DeleteSinhVien(SinhVien sinhVien);
    Task<SinhVien?> GetSinhVienDeleteAsync(Guid id, bool trackChanges); 
}
