using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.NganhExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleNganh.Services;

public class ServiceNganh : IServiceNganh
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    
    public ServiceNganh(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseNganhDto> CreateAsync(RequestAddNganhDto request)
    {
        var newNganh = _mapper.Map<Nganh>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.Nganh.CreateAsync(newNganh);
        });
        _loggerService.LogInfo("Thêm thông tin ngành thành công.");
        var nganhDto = _mapper.Map<ResponseNganhDto>(newNganh);
        return nganhDto;
    }

    public async Task DeleteAsync(Guid id)
    {
         if (id == Guid.Empty)
        {
            throw new NganhBadRequestException($"Ngành với {id} không được bỏ trống!");
        }
        var nganh = await _repositoryMaster.Nganh.GetNganhByIdAsync(id, false);
        if (nganh is null)
        {
            throw new NganhNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Nganh.DeleteNganh(nganh);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa ngành thành công.");
    }

    public async Task<(IEnumerable<ResponseNganhDto> data, PageInfo page)> GetAllNganhAsync(ParamBaseDto paramBaseDto)
    {
        var nganhs = await _repositoryMaster.Nganh.GetAllNganhAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var nganhDtos = _mapper.Map<IEnumerable<ResponseNganhDto>>(nganhs);
        return (data: nganhDtos, page: nganhs!.PageInfo);
    }

    public async Task<ResponseNganhDto> GetNganhByIdAsync(Guid id, bool trackChanges)
    {
        var nganh = await _repositoryMaster.Nganh.GetNganhByIdAsync(id, false);
        if (nganh is null)
        {
            throw new NganhNotFoundException(id);
        }
        var nganhDto = _mapper.Map<ResponseNganhDto>(nganh);
        return nganhDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateNganhDto request)
    {
        if (id != request.Id)
        {
            throw new NganhBadRequestException($"Id: {id} và Id: {request.Id} của ngành không giống nhau!");
        }
        var nganh = await _repositoryMaster.Nganh.GetNganhByIdAsync(id, false);
        if (nganh is null)
        {
            throw new NganhNotFoundException(id);
        }
        var nganhUpdate = _mapper.Map<Nganh>(request);
        nganhUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Nganh.UpdateNganh(nganhUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật ngành thành công.");
    }
}
