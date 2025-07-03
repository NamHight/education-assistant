using System;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Param;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleSinhVien.Services;

public interface IServiceSinhVien
{
    Task<(IEnumerable<ResponseSinhVienTinhTrangHocTapDto> data, PageInfo page)> GetAllSinhVienAsync(ParamSinhVienDto paramSinhVienDto);
    Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienByLopHocPhanIdAsync(ParamSinhVienByLopHocPhanDto paramSinhVienByLopHocPhanDto);
    // Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienByLopIdAsync(ParamSinhVienByLopDto paramBaseDto);
    Task<ResponseSinhVienDto> GetSinhVienByMssvAsync(string mssv);
    Task<ResponseSinhVienSummaryDto> GetALlSummaryAsync(Guid lopHocId);
    Task<ResponseSinhVienDto> GetSinhVienByIdAsync(Guid id, bool trackChanges);
    Task<ResponseSinhVienDto> CreateAsync(RequestAddSinhVienDto request);
    Task<ResponseSinhVienDangKyMonHocDto> CreateSinhVienDangKyMonHocAsync(RequestSinhVienDangKyMonHocDto request);
    Task<ResponseSinhVienDto> ReStoreSinhVienAsync(Guid id);
    Task ImportFileExcelAsync(RequestImportFileSinhVienDto request);
    Task<byte[]> ExportFileExcelAsync(Guid lopId);
    Task UpdateAsync(Guid id, RequestUpdateSinhVienDto request);
    Task DeleteAsync(Guid id);
}
