using Education_assistant.Modules.ModuleLopHoc.DTOs.Param;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHoc.Services
{
    public interface IServiceLopHoc
    {
        Task<(IEnumerable<ResponseLopHocDto> data, PageInfo page)> GetAllLopHocAsync(ParamLopHocDto paramLopHocDto);
        Task<IEnumerable<ResponseLopHocDto>> GetAllLopHocNoPageAsync();
        Task<ResponseLopHocDto> GetLopHocByIdAsync(Guid id, bool trackChanges);
        Task<ResponseLopHocDto> CreateAsync(RequestAddLopHocDto request);
        Task UpdateAsync(Guid id, RequestUpdateLopHocDto request);
        Task DeleteAsync(Guid id);
    }
}
