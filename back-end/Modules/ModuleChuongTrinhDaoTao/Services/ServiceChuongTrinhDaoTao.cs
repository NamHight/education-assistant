using System;
using System.Security.Cryptography;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;

public class ServiceChuongTrinhDaoTao : IServiceChuongTrinhDaoTao
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceChuongTrinhDaoTao(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseChuongTrinhDaoTaoDto> CreateAsync(RequestAddChuongTrinhDaoTaoDto request)
    {
        var ctDaoTaoExistting = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByMaAsync(request.MaChuongTrinh, false);
        if (ctDaoTaoExistting is not null)
        {
            throw new ChuongTrinhDaoTaoExistedException(request.MaChuongTrinh);
        }
        var newChuongTrinhDaoTao = _mapper.Map<ChuongTrinhDaoTao>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.ChuongTrinhDaoTao.CreateAsync(newChuongTrinhDaoTao);
        });
        _loggerService.LogInfo("Thêm chương trình đào tạo thành công.");
        var chuongyTrinhDaoTaoDto = _mapper.Map<ResponseChuongTrinhDaoTaoDto>(newChuongTrinhDaoTao);
        return chuongyTrinhDaoTaoDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        var ctDaoTao = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctDaoTao is null)
        {
            throw new ChuongTrinhDaoTaoNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChuongTrinhDaoTao.DeleteChuongTrinhDaoTao(ctDaoTao);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa chương trình đào tạo thành công.");
    }

    public async Task<(IEnumerable<ResponseChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChuongTrinhDaoTaoAsync(ParamBaseDto paramBaseDto)
    {
        var ctDaoTaos = await _repositoryMaster.ChuongTrinhDaoTao.GetAllPaginatedAndSearchOrSortAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOrder);
        var ctDaoTaoDto = _mapper.Map<IEnumerable<ResponseChuongTrinhDaoTaoDto>>(ctDaoTaos);
        return (data: ctDaoTaoDto, page: ctDaoTaos!.PageInfo);
    }

    public async Task<ResponseChuongTrinhDaoTaoDto> GetChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        var ctDaoTao = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, trackChanges);
        if (ctDaoTao is null)
        {
            throw new ChuongTrinhDaoTaoNotFoundException(id);
        }
        var ctDaoTaoDto = _mapper.Map<ResponseChuongTrinhDaoTaoDto>(ctDaoTao);
        return ctDaoTaoDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChuongTrinhDaoTaoDto request)
    {
        if (id != request.Id)
        {
            throw new ChuongTrinhDaoTaoBadRequestException($"Id: {id} và Id của chương trình đào tạo: {request.Id} không giống nhau!.");
        }
        var ctDaoTaoExistting = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctDaoTaoExistting is null)
        {
            throw new ChuongTrinhDaoTaoNotFoundException(id);
        }
        var ctDaoTaoUpdate = _mapper.Map<ChuongTrinhDaoTao>(request);
        ctDaoTaoUpdate.UpdatedAt = DateTime.Now;    
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChuongTrinhDaoTao.UpdateChuongTrinhDaoTao(ctDaoTaoUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật chương trình đào tạo thành công.");
    }
}
