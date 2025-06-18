using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.TuanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Modules.ModuleTuan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTuan.Services;

public class ServiceTuan : IServiceTuan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    
    public ServiceTuan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseTuanDto> CreateAsync(RequestAddTuanDto request)
    {
        var newTuan = _mapper.Map<Tuan>(request);
        newTuan.NgayKetThuc = newTuan.NgayBatDau!.Value.AddDays(6);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.Tuan.CreateAsync(newTuan);
        });
        _loggerService.LogInfo("Thêm thông tin tuần thành công.");
        var tuanDto = _mapper.Map<ResponseTuanDto>(newTuan);
        return tuanDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new TuanBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var tuan = await _repositoryMaster.Tuan.GetTuanByIdAsync(id, false);
        if (tuan is null)
        {
            throw new TuanNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Tuan.DeleteTuan(tuan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa tuần thành công.");
    }

    public async Task<(IEnumerable<ResponseTuanDto> data, PageInfo page)> GetAllTuanAsync(ParamBaseDto paramBaseDto)
    {
        var tuans = await _repositoryMaster.Tuan.GetAllTuanAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOrder);
        var tuanDtos = _mapper.Map<IEnumerable<ResponseTuanDto>>(tuans);
        return (data: tuanDtos, page: tuans!.PageInfo);
    }

    public async Task<ResponseTuanDto> GetTuanByIdAsync(Guid id, bool trackChanges)
    {
        var tuan = await _repositoryMaster.Tuan.GetTuanByIdAsync(id, false);
        if (tuan is null)
        {
            throw new TuanNotFoundException(id);
        }
        var tuanDto = _mapper.Map<ResponseTuanDto>(tuan);
        return tuanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateTuanDto request)
    {
        if (id != request.Id)
        {
            throw new TuanBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
        }
        var tuan = await _repositoryMaster.Tuan.GetTuanByIdAsync(id, false);
        if (tuan is null)
        {
            throw new TuanNotFoundException(id);
        }
        var tuanUpdate = _mapper.Map<Tuan>(request);
        tuanUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Tuan.UpdateTuan(tuanUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật tuần thành công.");
    }
}
