using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;

public interface IRepositoryChiTietLopHocPhan
{
    Task<PagedListAsync<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder, Guid? lopHocPhanId, bool? ngayNopDiem);
    Task<IEnumerable<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId, string search);
    Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<ChiTietLopHocPhan?> GetByMaSinhVienAndLopHocPhanIdAsync(string maSinhVien, Guid lopHocPhanId);
    Task<List<ResponseExportFileDiemSoDto>> GetAllDiemSoExportFileAsync(Guid lopHocPhanId);
    Task CreateAsync(ChiTietLopHocPhan chiTietLopHocPhan);
    void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
    Task<int> UpdateCtlhpWithPhanCongAsync(Guid maLhp, Guid giangVienId, Guid monHocId);
    Task<int> UpdateNgayNopDiemChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId);
    void DeleteChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
    Task DeleteListChiTietLopHocPhan(List<Guid> ids);
    Task<int> TinhPhanTramChuyenCanAsync(Guid sinhVienId);
}
