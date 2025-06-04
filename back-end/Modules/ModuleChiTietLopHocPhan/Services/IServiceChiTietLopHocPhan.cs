using System;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;

public interface IServiceChiTietLopHocPhan
{
    Task<(IEnumerable<ResponseChiTietLopHocPhanDto> data, PageInfo page)> GetAllChiTietLopHocPhanAsync(ParamBaseDto paramBaseDto);
    Task<ResponseChiTietLopHocPhanDto> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges);
    Task<ResponseChiTietLopHocPhanDto> CreateAsync(RequestAddChiTietLopHocPhanDto request);
    Task UpdateAsync(Guid id, RequestUpdateChiTietLopHocPhanDto request);
    Task UpdateListChiTietLopHocPhanAsync(List<RequestUpdateChiTietLopHocPhanDto> listRequest);
    Task DeleteAsync(Guid id);
}
