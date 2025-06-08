using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;

public class ServiceChiTietChuongTrinhDaoTao : IServiceChiTietChuongTrinhDaoTao
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceChiTietChuongTrinhDaoTao(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseChiTietChuongTrinhDaoTaoDto> CreateAsync(RequestAddChiTietChuongTrinhDaoTaoDto request)
    {
        var newctctDaoTao = _mapper.Map<ChiTietChuongTrinhDaoTao>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.ChiTietChuongTrinhDaoTao.CreateAsync(newctctDaoTao);
        });
        _loggerService.LogInfo("Thêm thông tin chi tiết chương trình đào tạo thành công");
        var ctctDaoTaoDto = _mapper.Map<ResponseChiTietChuongTrinhDaoTaoDto>(newctctDaoTao);
        return ctctDaoTaoDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new ChiTietChuongTrinhDaoTaoBadRequestException($"Chi tiết chương trình đào tạo với {id} không được bỏ trống!");
        }
        var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctctDaoTao is null)
        {
            throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChiTietChuongTrinhDaoTao.DeleteChiTietChuongTrinhDaoTao(ctctDaoTao);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa chi tiết chương trình đào tạo thành công.");
    }

    public async Task<(IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChiTietChuongTrinhDaoTaoAsync(ParamBaseDto paramBaseDto)
    {
        var ctctDaoTaos = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetAllChiTietChuongTrinhDaoTaoAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var ctctDaoTaoDto = _mapper.Map<IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto>>(ctctDaoTaos);
        return (data: ctctDaoTaoDto, page: ctctDaoTaos!.PageInfo);
    }

    public async Task<ResponseChiTietChuongTrinhDaoTaoDto> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctctDaoTao is null)
        {
            throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
        }
        var ctctDaoTaoDto = _mapper.Map<ResponseChiTietChuongTrinhDaoTaoDto>(ctctDaoTao);
        return ctctDaoTaoDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChiTietChuongTrinhDaoTaoDto request)
    {
        if (id != request.Id)
        {
            throw new ChiTietChuongTrinhDaoTaoBadRequestException($"Id và Id của chi tiết chương trình đào tạo không giống nhau!");
        }
        var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctctDaoTao is null)
        {
            throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
        }
        var ctctDaoTaoUpdate = _mapper.Map<ChiTietChuongTrinhDaoTao>(request);
        ctctDaoTaoUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChiTietChuongTrinhDaoTao.UpdateChiTietChuongTrinhDaoTao(ctctDaoTaoUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật chi tiết chương trình đào tạo thành công.");
    }
}
