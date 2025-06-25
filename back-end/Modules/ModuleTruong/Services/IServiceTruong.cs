using Education_assistant.Modules.ModuleTruong.DTOs.Param;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;

namespace Education_assistant.Modules.ModuleTruong.Services;

public interface IServiceTruong
{
    Task<Dictionary<string, string>> GetTruongAsync();
    Task<IEnumerable<ResponseTruongDto>> GetAllTruongAsync(ParamTruongDto paramTruongDto);
    Task<ResponseTruongDto> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task ImportFileImageTruongAsync(RequestUpdateFileTruongDto requestUpdateFileDto);
    Task<ResponseTruongDto> CreateAsync(RequestAddTruongDto request);
    Task UpdateAsync(Guid id, RequestUpdateTruongDto request);
    Task DeleteAsync(Guid id);
}