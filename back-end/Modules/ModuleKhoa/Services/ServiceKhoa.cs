using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ThrowErrorKhoas;
using Education_assistant.Exceptions.ThrowError.ThrowErrorTruongs;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleKhoa.Services;

public class ServiceKhoa : IServiceKhoa
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    
    public ServiceKhoa(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseKhoaDto> CreateAsync(RequestAddKhoaDto request)
    {
        if (request is null)
        {
            throw new KhoaBadRequestException("Thông tin Khoa đầu vào không đủ thông tin!");
        }
        var newKhoa = _mapper.Map<Khoa>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.Khoa.CreateAsync(newKhoa);
        });
        _loggerService.LogInfo("Thêm thông tin khoa thành công.");
        var khoaDto = _mapper.Map<ResponseKhoaDto>(newKhoa);
        return khoaDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new KhoaBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, false);
        if (khoa is null)
        {
            throw new KhoaNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Khoa.DeleteKhoa(khoa);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa khoa thành công.");
    }

    public async Task<(IEnumerable<ResponseKhoaDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamBaseDto paramBaseDto)
    {
        var khoas = await _repositoryMaster.Khoa.GetAllPaginatedAndSearchOrSortAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var khoaDto = _mapper.Map<IEnumerable<ResponseKhoaDto>>(khoas);
        return (data: khoaDto, page: khoas!.PageInfo);
    }

    public async Task<ResponseKhoaDto> GetKhoaByIdAsync(Guid id, bool trackChanges)
    {
        var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, false);
        if (khoa is null)
        {
            throw new KhoaNotFoundException(id);
        }
        var khoaDto = _mapper.Map<ResponseKhoaDto>(khoa);
        return khoaDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateKhoaDto request)
    {
        if (id != request.Id)
        {
            throw new KhoaBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
        }
        if (request is null)
        {
            throw new TruongBadRequestException($"Thông tin khoa không đầy đủ!");
        }
        var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, false);
        if (khoa is null)
        {
            throw new KhoaNotFoundException(id);
        }
        var khoaUpdate = _mapper.Map<Khoa>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Khoa.UpdateKhoa(khoaUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật khoa thành công.");
    }
}
