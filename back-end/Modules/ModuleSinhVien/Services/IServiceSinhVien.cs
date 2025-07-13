using Education_assistant.Modules.ModuleSinhVien.DTOs.Param;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleSinhVien.Services;

public interface IServiceSinhVien
{
    Task<(IEnumerable<ResponseSinhVienTinhTrangHocTapDto> data, PageInfo page)> GetAllSinhVienAsync(
        ParamSinhVienDto paramSinhVienDto);

    Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienByLopHocPhanIdAsync(
        ParamSinhVienByLopHocPhanDto paramSinhVienByLopHocPhanDto);

    Task<IEnumerable<SinhVienSimpleDto>> GetAllSinhVienByLopHocIdAsync(Guid lopHocId);

    // Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienByLopIdAsync(ParamSinhVienByLopDto paramBaseDto);
    Task<ResponseSinhVienDto> GetSinhVienByMssvAsync(string mssv);
    Task<ResponseSinhVienSummaryDto> GetALlSummaryAsync(Guid lopHocId);
    Task<ResponseSinhVienDto> GetSinhVienByIdAsync(Guid id, bool trackChanges);
    Task<ResponseSinhVienDto> CreateAsync(RequestAddSinhVienDto request);
    Task UpdateChuyenSinhVienByLopHocAsync(RequestAddSinhVienChuyenLopDto request);
    Task<ResponseSinhVienDangKyMonHocDto> CreateSinhVienDangKyMonHocAsync(RequestSinhVienDangKyMonHocDto request);
    Task<ResponseSinhVienDto> ReStoreSinhVienAsync(Guid id);
    Task ImportFileExcelAsync(RequestImportFileSinhVienDto request);
    Task<byte[]> ExportFileExcelAsync(Guid lopId);
    Task UpdateAsync(Guid id, RequestUpdateSinhVienDto request);
    Task DeleteSinhVienKhoiLopHocPhanAsync(Guid sinhVienId, Guid lopHocPhanId);
    Task DeleteAsync(Guid id);
    Task UpdateTrangThaiSinhVienAsync(Guid id, int trangThai);
}