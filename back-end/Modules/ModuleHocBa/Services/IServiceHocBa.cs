using Education_assistant.Modules.ModuleHocBa.DTOs.Param;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleHocBa.Services;

public interface IServiceHocBa
{
    Task<(IEnumerable<ResponseHocBaDto> data, PageInfo page)> GetAllHocBaAsync(ParamHocBaDto paramHocBaDto);
    Task<IEnumerable<ResponseHocBaProfileDto>> GetAllHocBaBySinhVienAsync(ParamHocBaBySinhVienDto param);
    Task<ResponseHocBaDto> GetHocBaByIdAsync(Guid id, bool trackChanges);
    Task<ResponseHocBaDto> CreateAsync(RequestAddHocbaDto request);

    Task UpdateAsync(Guid id, RequestUpdateHocbaDto request);

    // Task UpdateListHocBaAsync(List<RequestUpdateHocbaDto> listRequest);
    Task UpdateListHocBaAsync(RequestListUpdateHocbaDto request);
    Task DeleteAsync(Guid id);
    Task DeleteListHocBaAsync(RequestDeleteHocBaDto request);
}