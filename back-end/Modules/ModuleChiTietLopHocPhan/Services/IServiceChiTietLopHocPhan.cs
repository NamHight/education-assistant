using System;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;

public interface IServiceChiTietLopHocPhan
{
    Task<(IEnumerable<ResponseChiTietLopHocPhanDto> data, PageInfo page)> GetAllChiTietLopHocPhanAsync(ParamChiTietLopHocPhanDto paramChiTietLopHocPhanDto);
    Task<IEnumerable<ResponseChiTietLopHocPhanByLopHocPhanDto>> GetAllChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId, ParamChiTietLopHocPhanSimpleDto ParamChiTietLopHocPhanSimpleDto);
    Task<ResponseChiTietLopHocPhanDto> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<ResponseChiTietLopHocPhanDto> CreateAsync(RequestAddChiTietLopHocPhanDto request);
    Task ImportFileExcelAsync(RequestImportFileDiemSoDto request);
    Task<byte[]> ExportFileExcelAsync(Guid lopHocPhanId);
    Task UpdateAsync(Guid id, RequestUpdateChiTietLopHocPhanDto request);
    Task UpdateListChiTietLopHocPhanAsync(RequestListUpdateDiemSoDto request);
    Task UpdateNopDiemChiTietLopHocPhanAsync(Guid lopHocPhanId);
    Task DeleteAsync(Guid id);
    Task DeleteListChiTietLopHocPhanAsync(RequestDeleteChiTietLopHocPhanDto request);
}
