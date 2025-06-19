using System;
using Education_assistant.Modules.ModuleTuan.DTOs.Param;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Modules.ModuleTuan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTuan.Services;

public interface IServiceTuan
{
    Task<(IEnumerable<ResponseTuanDto> data, PageInfo page)> GetAllTuanAsync(ParamTuanDto paramTuanDto);
    Task<IEnumerable<ResponseTuanDto>> GetTuanComboBoxAsync(ParamTuanCopyDto paramTuanDto);
    Task<ResponseTuanDto> GetTuanByIdAsync(Guid id, bool trackChanges);
    Task<ResponseTuanDto> CreateAsync(RequestAddTuanDto request);
    Task UpdateAsync(Guid id, RequestUpdateTuanDto request);
    Task DeleteAsync(Guid id);
}
