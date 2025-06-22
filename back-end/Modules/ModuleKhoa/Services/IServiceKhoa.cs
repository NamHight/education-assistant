using System;
using Education_assistant.Modules.ModuleKhoa.DTOs.Param;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleKhoa.Services;

public interface IServiceKhoa
{
    Task<(IEnumerable<ResponseKhoaDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamKhoaDto paramKhoaDto);
    Task<ResponseKhoaDto> GetKhoaByIdAsync(Guid id, bool trackChanges);
    Task<ResponseKhoaDto> CreateAsync(RequestAddKhoaDto request);
    Task UpdateAsync(Guid id, RequestUpdateKhoaDto request);
    Task DeleteAsync(Guid id);
}
