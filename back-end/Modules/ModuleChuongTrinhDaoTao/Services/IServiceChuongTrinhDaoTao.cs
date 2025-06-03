using System;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;

public interface IServiceChuongTrinhDaoTao
{
    Task<(IEnumerable<ResponseChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChuongTrinhDaoTaoAsync(ParamBaseDto paramBaseDto);
    Task<ResponseChuongTrinhDaoTaoDto> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task<ResponseChuongTrinhDaoTaoDto> CreateAsync(RequestAddChuongTrinhDaoTaoDto request);
    Task UpdateAsync(Guid id, RequestUpdateChuongTrinhDaoTaoDto request);
    Task DeleteAsync(Guid id);
}
