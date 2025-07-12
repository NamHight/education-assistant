
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Param;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModulePhongHoc.Services
{
    public interface IServicePhongHoc
    {
        Task<(IEnumerable<ResponsePhongHocDto> data, PageInfo page)> GetAllPhongHocAsync(ParamPhongHocDto paramPhongHocDto);
        Task<IEnumerable<ResponsePhongHocDto>> GetAllPhongHocNoPageAsync();
        Task<List<string>?> GetAllToaNhaAsync();
        Task<ResponsePhongHocAutoDto> GenericPhongHocAutoVirtualListAsync(RequestAddPhongHocVirtualListDto request);
        Task<ResponsePhongHocDto> GetPhongHocByIdAsync(Guid id, bool trackChanges);
        Task<ResponsePhongHocAutoDto> CreateListPhongHocAsync(RequestAddPhongHocAutoDto request);
        Task<ResponsePhongHocDto> CreateAsync(RequestAddPhongHocDto request);
        Task UpdateAsync(Guid id, RequestUpdatePhongHocDto request);
        Task UpdateTrangThaiAsync(Guid id, int trangThai);
        Task DeleteAsync(Guid id);
    }
}
