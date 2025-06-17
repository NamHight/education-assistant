
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModulePhongHoc.Services
{
    public interface IServicePhongHoc
    {
        Task<(IEnumerable<ResponsePhongHocDto> data, PageInfo page)> GetAllPhongHocAsync(ParamBaseDto paramBaseDto);
        Task<ResponsePhongHocDto> GetPhongHocByIdAsync(Guid id, bool trackChanges);
        Task<ResponsePhongHocDto> CreateAsync(RequestAddPhongHocDto request);
        Task UpdateAsync(Guid id, RequestUpdatePhongHocDto request);
        Task DeleteAsync(Guid id);
    }
}
