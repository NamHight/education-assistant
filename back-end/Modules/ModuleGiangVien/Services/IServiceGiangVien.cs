using Education_assistant.Modules.ModuleGiangVien.Dtos.Param;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public interface IServiceGiangVien
{
    Task<(IEnumerable<ResponseGiangVienDto> data, PageInfo page)> GetAllGiangVienAsync(
        ParamGiangVienDto paramGiangVienDto);

    Task<IEnumerable<ResponseGiangVienDto>?> GetAllGiangVienByKhoa(Guid khoaId);
    Task<IEnumerable<GiangVienSummaryDto>?> GetAllGiangVienByBoMonAsync(Guid boMonId); 
    Task<ResponseGiangVienDto> GetGiangVienByIdAsync(Guid id, bool trackChanges);
    Task<ResponseGiangVienDto> ReStoreGiangVienAsync(Guid id);
    Task<ResponseGiangVienDto> CreateAsync(RequestAddGiangVienDto request);
    Task UpdateAsync(Guid id, RequestUpdateGiangVienDto request);
    Task UpdateOptionalAsync(Guid id, RequestUpdateGiangVienOptionDto request);
    Task DeleteAsync(Guid id);
}