using System;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Param;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleMonHoc.Services;

public interface IServiceMonHoc
{
    Task<(IEnumerable<ResponseMonHocDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamMonHocDto paramMonHocDto);
    Task<ResponseMonHocDto> GetMonHocByIdAsync(Guid id, bool trackChanges);
    Task<ResponseMonHocDto> CreateAsync(RequestAddMonHocDto request);
    Task UpdateAsync(Guid id, RequestUpdateMonHocDto request);
    Task DeleteAsync(Guid id);
    Task<List<ResponseMonHocDto>> GetMonHocByKhoaIdAsync(Guid khoaId, bool trackChanges);

}
