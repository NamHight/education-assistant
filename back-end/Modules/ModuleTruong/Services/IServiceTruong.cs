using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;

namespace Education_assistant.Modules.ModuleTruong.Services;

public interface IServiceTruong
{
    Task<ResponseTruongDto> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task<ResponseTruongDto> CreateAsync(RequestAddTruongDto request);
    Task UpdateAsync(Guid id, RequestUpdateTruongDto request);
    Task DeleteAsync(Guid id);
}