using System;
using Education_assistant.Modules.ModuleBoMon.DTOs.Param;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleBoMon.Services;

public interface IServiceBoMon
{
    Task<(IEnumerable<ResponseBoMonDto> data, PageInfo page)> GetAllBoMonAsync(ParamBoMonDto paramBoMonDto);
    Task<IEnumerable<BoMonSummaryDto>> GetAllBoMonNoPageAsync(); 
    Task<ResponseBoMonDto> GetBoMonByIdAsync(Guid id, bool trackChanges);
    Task<ResponseBoMonDto> CreateAsync(RequestAddBoMonDto request);
    Task UpdateAsync(Guid id, RequestUpdateBoMonDto request);
    Task DeleteAsync(Guid id);
    Task<List<ResponseBoMonDto>> GetBoMonByKhoaIdAsync(Guid khoaId, bool trackChanges);

}
