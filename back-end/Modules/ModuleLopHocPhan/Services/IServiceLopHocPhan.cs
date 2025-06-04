using System;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHocPhan.Services;

public interface IServiceLopHocPhan
{
    Task<(IEnumerable<ResponseLopHocPhanDto> data, PageInfo page)> GetAllLopHocPhanAsync(ParamBaseDto paramBaseDto);
    Task<ResponseLopHocPhanDto> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<ResponseLopHocPhanDto> CreateAsync(RequestAddLopHocPhanDto request);
    Task UpdateAsync(Guid id, RequestUpdateLopHocPhanDto request);
    Task DeleteAsync(Guid id);
}
