using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.HocBaExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleHocBa.Services;

public class ServiceHocBa : IServiceHocBa
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    
    public ServiceHocBa(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseHocBaDto> CreateAsync(RequestAddHocbaDto request)
    {
        var newHocBa = _mapper.Map<HocBa>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.HocBa.CreateAsync(newHocBa);
        });
        _loggerService.LogInfo("Thêm thông tin học bạ thành công.");
        var hocBaDto = _mapper.Map<ResponseHocBaDto>(newHocBa);
        return hocBaDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new HocBaBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.HocBa.DeleteHocBa(hocBa);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa học bạ thành công.");
    }

    public async Task<(IEnumerable<ResponseHocBaDto> data, PageInfo page)> GetAllHocBaAsync(ParamBaseDto paramBaseDto)
    {
        var hocBas = await _repositoryMaster.HocBa.GetAllHocBaAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var hocBaDtos = _mapper.Map<IEnumerable<ResponseHocBaDto>>(hocBas);
        return (data: hocBaDtos, page: hocBas!.PageInfo);
    }

    public async Task<ResponseHocBaDto> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        var hocBaDto = _mapper.Map<ResponseHocBaDto>(hocBa);
        return hocBaDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateHocbaDto request)
    {
        if (id != request.Id)
        {
            throw new HocBaBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
        }
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        var hocBaUpdate = _mapper.Map<HocBa>(request);
        hocBaUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.HocBa.UpdateHocBa(hocBaUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật học bạ thành công.");
    }
}
