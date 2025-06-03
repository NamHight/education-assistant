using System;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTruong.Services;

public interface IServiceTruong
{
    Task<(IEnumerable<ResponseTruongDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamPageAndSearchBaseDto paramBaseDto);
    Task<ResponseTruongDto> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task<ResponseTruongDto> CreateAsync(RequestAddTruongDto request);
    Task UpdateAsync(Guid id, RequestUpdateTruongDto request);
    Task DeleteAsync(Guid id);
}
