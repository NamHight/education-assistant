using Education_assistant.Models;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public interface IServiceGiangVien
{
    Task<(IEnumerable<ResponseGiangVienDto> data, PageInfo page)> GetAllGiangVienAsync(ParamBaseDto paramBaseDto);
    Task<ResponseGiangVienDto> GetGiangVienByIdAsync(Guid id, bool trackChanges);
    Task<ResponseGiangVienDto> ReStoreGiangVienAsync(Guid id);
    Task<ResponseGiangVienDto> CreateAsync(RequestAddGiangVienDto request);
    Task UpdateAsync(Guid id, RequestUpdateGiangVienDto request);
    Task DeleteAsync(Guid id);
}