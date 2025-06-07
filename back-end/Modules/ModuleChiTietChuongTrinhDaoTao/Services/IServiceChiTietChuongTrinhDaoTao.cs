using System;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;

public interface IServiceChiTietChuongTrinhDaoTao
{
    Task<(IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChiTietChuongTrinhDaoTaoAsync(ParamBaseDto paramBaseDto);
    Task<ResponseChiTietChuongTrinhDaoTaoDto> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task<ResponseChiTietChuongTrinhDaoTaoDto> CreateAsync(RequestAddChiTietChuongTrinhDaoTaoDto request);
    Task UpdateAsync(Guid id, RequestUpdateChiTietChuongTrinhDaoTaoDto request);
    Task DeleteAsync(Guid id);
}
