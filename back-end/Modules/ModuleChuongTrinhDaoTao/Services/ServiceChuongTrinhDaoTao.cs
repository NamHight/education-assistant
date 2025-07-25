using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Param;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;

public class ServiceChuongTrinhDaoTao : IServiceChuongTrinhDaoTao
{
    private readonly ILayKyTuHelper _layKyTuHelper;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceChuongTrinhDaoTao(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper,
        ILayKyTuHelper layKyTuHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _layKyTuHelper = layKyTuHelper;
    }

    public async Task<ResponseChuongTrinhDaoTaoDto> CreateAsync(RequestAddChuongTrinhDaoTaoDto request)
    {
        try
        {
            var ChuongTrinhDaoTao =
                await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(request.Khoa.Value,
                    request.NganhId.Value);
            if (ChuongTrinhDaoTao is not null)
                throw new ChuongTrinhDaoTaoBadRequestException(
                    "Đã có chương trình đào tạo theo khóa thuộc ngành này rồi");

            var newChuongTrinhDaoTao = _mapper.Map<ChuongTrinhDaoTao>(request);
            newChuongTrinhDaoTao.MaChuongTrinh = _layKyTuHelper.LayKyTuDau(newChuongTrinhDaoTao.TenChuongTrinh) +
                                                 newChuongTrinhDaoTao.Khoa;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.ChuongTrinhDaoTao.CreateAsync(newChuongTrinhDaoTao);
            });
            _loggerService.LogInfo("Thêm chương trình đào tạo thành công.");
            var chuongyTrinhDaoTaoDto = _mapper.Map<ResponseChuongTrinhDaoTaoDto>(newChuongTrinhDaoTao);
            return chuongyTrinhDaoTaoDto;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        try
        {
            var ctDaoTao = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, false);
            if (ctDaoTao is null) throw new ChuongTrinhDaoTaoNotFoundException(id);
            ctDaoTao.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.ChuongTrinhDaoTao.UpdateChuongTrinhDaoTao(ctDaoTao);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa chương trình đào tạo thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                                              inner.Contains("reference constraint") ||
                                              inner.Contains("violates foreign key constraint") ||
                                              inner.Contains("cannot delete or update a parent row")))
                throw new ChuongTrinhDaoTaoBadRequestException(
                    "Không thể xóa chương trình đào tạo vì có ràng buộc khóa ngoại!.");
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task<(IEnumerable<ResponseChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChuongTrinhDaoTaoAsync(
        ParamChuongTrinhDaoTaoDto paramChuongTrinhDaoTaoDto)
    {
        var page = paramChuongTrinhDaoTaoDto.page;
        var limit = paramChuongTrinhDaoTaoDto.limit;
        var ctDaoTaos = await _repositoryMaster.ChuongTrinhDaoTao.GetAllPaginatedAndSearchOrSortAsync(
            paramChuongTrinhDaoTaoDto.page, paramChuongTrinhDaoTaoDto.limit, paramChuongTrinhDaoTaoDto.search,
            paramChuongTrinhDaoTaoDto.sortBy, paramChuongTrinhDaoTaoDto.sortByOrder, paramChuongTrinhDaoTaoDto.nganhId);
        var startIndex = (page - 1) * limit;
        var ctDaoTaoDto = _mapper.Map<IEnumerable<ResponseChuongTrinhDaoTaoDto>>(ctDaoTaos)
            .Select((item, index) =>
            {
                item.STT = startIndex + index + 1;
                return item;
            });
        return (data: ctDaoTaoDto, page: ctDaoTaos!.PageInfo);
    }

    public async Task<ResponseChuongTrinhDaoTaoDto> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        var ctDaoTao = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, trackChanges);
        if (ctDaoTao is null) throw new ChuongTrinhDaoTaoNotFoundException(id);
        var ctDaoTaoDto = _mapper.Map<ResponseChuongTrinhDaoTaoDto>(ctDaoTao);
        return ctDaoTaoDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChuongTrinhDaoTaoDto request)
    {
        try
        {
            if (id != request.Id)
                throw new ChuongTrinhDaoTaoBadRequestException(
                    $"Id: {id} và Id của chương trình đào tạo: {request.Id} không giống nhau!.");
            var ctDaoTaoExistting = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, true);
            if (ctDaoTaoExistting is null) throw new ChuongTrinhDaoTaoNotFoundException(id);
            if (ctDaoTaoExistting.Khoa != request.Khoa)
            {
                var ChuongTrinhDaoTao =
                    await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(
                        request.Khoa.Value, request.NganhId.Value);
                if (ChuongTrinhDaoTao is not null)
                    throw new ChuongTrinhDaoTaoBadRequestException(
                        "Đã có chương trình đào tạo theo khóa thuộc ngành này rồi");
                ctDaoTaoExistting.Khoa = request.Khoa;
            }

            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                ctDaoTaoExistting.MaChuongTrinh = _layKyTuHelper.LayKyTuDau(request.TenChuongTrinh) + request.Khoa;
                ctDaoTaoExistting.TenChuongTrinh = request.TenChuongTrinh;
                ctDaoTaoExistting.LoaiChuonTrinhDaoTao = request.LoaiChuonTrinhDaoTao;
                ctDaoTaoExistting.MoTa = request.MoTa;
                ctDaoTaoExistting.TongSoTinChi = request.TongSoTinChi;
                ctDaoTaoExistting.ThoiGianDaoTao = request.ThoiGianDaoTao;
                ctDaoTaoExistting.Khoa = request.Khoa;
                ctDaoTaoExistting.NganhId = request.NganhId;
                ctDaoTaoExistting.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật chương trình đào tạo thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }
}