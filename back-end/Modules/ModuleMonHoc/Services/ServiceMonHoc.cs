using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ThrowErrorMonHoc;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleMonHoc.Services;

public class ServiceMonHoc : IServiceMonHoc
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceMonHoc(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseMonHocDto> CreateAsync(RequestAddMonHocDto request)
    {
        if (request is null)
        {
            throw new MonHocBadRequestException("Thông tin trường đầu vào không đủ thông tin!");
        }
        var newMonHoc = _mapper.Map<MonHoc>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.MonHoc.CreateAsync(newMonHoc);
        });
        _loggerService.LogInfo("Thêm thông tin trường thành công.");
        var monHocDto = _mapper.Map<ResponseMonHocDto>(newMonHoc);
        return monHocDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new MonHocBadRequestException($"Trường với {id} không được bỏ trống!");
        }
        var monHoc = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(id, false);
        if (monHoc is null)
        {
            throw new MonHocNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.MonHoc.DeleteMonHoc(monHoc);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa môn học thành công.");
    }

    public async Task<(IEnumerable<ResponseMonHocDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamBaseDto paramBaseDto)
    {
        var monHocs = await _repositoryMaster.MonHoc.GetAllPaginatedAndSearchOrSortAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var monHocDto = _mapper.Map<IEnumerable<ResponseMonHocDto>>(monHocs);
        return (data: monHocDto, page: monHocs.PageInfo);
    }

    public async Task<ResponseMonHocDto> GetMonHocByIdAsync(Guid id, bool trackChanges)
    {
        var monHoc = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(id, false);
        if (monHoc is null)
        {
            throw new MonHocNotFoundException(id);
        }
        var monHocDto = _mapper.Map<ResponseMonHocDto>(monHoc);
        return monHocDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateMonHocDto request)
    {
        if (id != request.Id)
        {
            throw new MonHocBadRequestException($"Id và Id của trường không giống nhau!");
        }
        if (request is null)
        {
            throw new MonHocBadRequestException($"Thông tin trường không đầy đủ!");
        }
        var truong = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(id, false);
        if (truong is null)
        {
            throw new MonHocNotFoundException(id);
        }
        var monHocUpdate = _mapper.Map<MonHoc>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.MonHoc.UpdateMonHoc(monHocUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật môn học thành công.");
    }
}
