using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;

public interface IRepositoryChiTietLopHocPhan
{
    Task<PagedListAsync<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder);
    Task<IEnumerable<ResponseDanhSachDiemSoByLopDto>> GetAllDiemSoByLopHocAsync(Guid lopHocPhanId, int hocKy, int loaiMonHoc, int namHoc, Guid chuongTrinhId);
    Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(ChiTietLopHocPhan chiTietLopHocPhan);
    void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
    void DeleteChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan);
}
