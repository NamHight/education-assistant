using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;

public interface IServiceChiTietChuongTrinhDaoTao
{
    Task<(IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChiTietChuongTrinhDaoTaoAsync(ParamChiTietChuongTrinhDaoTaoDto paramChiTietChuongTrinhDaoTaoDto);
    Task<ResponseChiTietChuongTrinhDaoTaoDto> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges);
    Task<IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto>?> GetAllCtctdtByCtdtIdAsync(Guid id, int hocKy);
    Task<ResponseChiTietChuongTrinhDaoTaoDto> CreateAsync(RequestAddChiTietChuongTrinhDaoTaoDto request);
    Task UpdateAsync(Guid id, RequestUpdateChiTietChuongTrinhDaoTaoDto request);
    Task DeleteAsync(Guid id);
}
