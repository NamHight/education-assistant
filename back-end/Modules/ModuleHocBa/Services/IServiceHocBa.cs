using System;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleHocBa.Services;

public interface IServiceHocBa
{
    Task<(IEnumerable<ResponseHocBaDto> data, PageInfo page)> GetAllHocBaAsync(ParamBaseDto paramBaseDto);
    Task<ResponseHocBaDto> GetHocBaByIdAsync(Guid id, bool trackChanges);
    Task<ResponseHocBaDto> CreateAsync(RequestAddHocbaDto request);
    Task UpdateAsync(Guid id, RequestUpdateHocbaDto request);
    Task UpdateListHocBaAsync(List<RequestUpdateHocbaDto> listRequest);
    Task DeleteAsync(Guid id);
}
