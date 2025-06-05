using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Request;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLichBieu.Services
{
    public interface IServiceLichBieu
    {
        Task<(IEnumerable<ResponseLichBieuDto> data, PageInfo page)> GetAllLichBieuAsync(ParamPaginationBaseDto paramBaseDto);
        Task<ResponseLichBieuDto> GetLichBieuByIdAsync(Guid id, bool trackChanges);
        Task<ResponseLichBieuDto> CreateAsync(RequestAddLichBieuDto request);
        Task UpdateAsync(Guid id, RequestUpdateLichBieuDto request);
        Task DeleteAsync(Guid id);
    }
}
