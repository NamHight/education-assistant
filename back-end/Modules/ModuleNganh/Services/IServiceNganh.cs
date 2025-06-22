using System;
using Education_assistant.Modules.ModuleNganh.DTOs.Param;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleNganh.Services;

public interface IServiceNganh
{
    Task<(IEnumerable<ResponseNganhDto> data, PageInfo page)> GetAllNganhAsync(ParamNganhDto paramNganhDto);
    Task<ResponseNganhDto> GetNganhByIdAsync(Guid id, bool trackChanges);
    Task<ResponseNganhDto> CreateAsync(RequestAddNganhDto request);
    Task UpdateAsync(Guid id, RequestUpdateNganhDto request);
    Task DeleteAsync(Guid id);
}
