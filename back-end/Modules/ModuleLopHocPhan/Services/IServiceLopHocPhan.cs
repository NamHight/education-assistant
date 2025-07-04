using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHocPhan.Services;

public interface IServiceLopHocPhan
{
    Task<(IEnumerable<ResponseLopHocPhanDto> data, PageInfo page)> GetAllLopHocPhanAsync(ParamLopHocPhanDto paramLopHocPhanDto);
    Task<IEnumerable<ResponseLopHocPhanDto>> GetAllLopHocPhanByGiangVienAsync(ParamLopHocPhanSimpleDto paramLopHocPhanSimpleDto);
    Task<IEnumerable<ResponseLopHocPhanDto>> GetAllLopHocPhanNoPageAsync();
    Task<IEnumerable<ResponseLopHocPhanDto>> GetAllLopHocPhanByLopHocAndHocKyAsync(ParamLopHocPhanForLichBieuDto param);
    Task<ResponseLopHocPhanDto> GetLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<ResponseLopHocPhanDto> CreateAsync(RequestAddLopHocPhanDto request);
    Task CreateAutoLopHocPhanAsync(RequestGenerateLopHocPhanDto request);
    Task UpdateAsync(Guid id, RequestUpdateSimpleLopHocPhanDto request);
    Task UpdateTrangThaiAsync(Guid id, int trangThai);
    Task UpdateListLophocPhanAsync(List<RequestUpdateLopHocPhanDto> listRequest);
    Task DeleteAsync(Guid id);
    
}