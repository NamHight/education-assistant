using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.BoMonExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleBoMon.Services;

public class ServiceBoMon : IServiceBoMon
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceBoMon(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseBoMonDto> CreateAsync(RequestAddBoMonDto request)
    {
        var newBoMon = _mapper.Map<BoMon>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.BoMon.CreateAsync(newBoMon);
        });
        _loggerService.LogInfo("Thêm thông tin bộ môn thành công.");
        var monHocDto = _mapper.Map<ResponseBoMonDto>(newBoMon);
        return monHocDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        var boMon = await _repositoryMaster.BoMon.GetBoMonByIdAsync(id, false);
        if (boMon is null)
        {
            throw new BoMonNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.BoMon.DeleteBoMon(boMon);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa bộ môn thành công.");
    }

    public async Task<(IEnumerable<ResponseBoMonDto> data, PageInfo page)> GetAllBoMonAsync(ParamBaseDto paramBaseDto)
    {
        var boMons = await _repositoryMaster.BoMon.GetAllPaginatedAndSearchOrSortAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOrder);
        var boMonDto = _mapper.Map<IEnumerable<ResponseBoMonDto>>(boMons);
        return (data: boMonDto, page: boMons!.PageInfo);
    }

    public async Task<ResponseBoMonDto> GetBoMonByIdAsync(Guid id, bool trackChanges)
    {
        var boMon = await _repositoryMaster.BoMon.GetBoMonByIdAsync(id, false);
        if (boMon is null)
        {
            throw new BoMonNotFoundException(id);
        }
        var boMonDto = _mapper.Map<ResponseBoMonDto>(boMon);
        return boMonDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateBoMonDto request)
    {
        if (id != request.Id)
        {
            throw new BoMonBadRequestException($"Id: {id} và Id: {request.Id} của bộ môn không giống nhau!");
        }
         var boMonExsitting = await _repositoryMaster.BoMon.GetBoMonByIdAsync(id, false);
        if (boMonExsitting is null)
        {
            throw new BoMonNotFoundException(id);
        }
        var boMonUpdate = _mapper.Map<BoMon>(request);
        boMonUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.BoMon.UpdateBoMon(boMonUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật bộ môn thành công.");
    }
}
