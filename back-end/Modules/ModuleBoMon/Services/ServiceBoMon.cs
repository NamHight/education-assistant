using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.BoMonExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleBoMon.DTOs.Param;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleBoMon.Services;

public class ServiceBoMon : IServiceBoMon
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly ILayKyTuHelper _layKyTuHelper;
    public ServiceBoMon(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, ILayKyTuHelper layKyTuHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _layKyTuHelper = layKyTuHelper;
    }
    public async Task<ResponseBoMonDto> CreateAsync(RequestAddBoMonDto request)
    {
        try
        {
            var newBoMon = _mapper.Map<BoMon>(request);
            newBoMon.MaBoMon = _layKyTuHelper.LayKyTuDau(request.TenBoMon);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.BoMon.CreateAsync(newBoMon);
            });
            _loggerService.LogInfo("Thêm thông tin bộ môn thành công.");
            var monHocDto = _mapper.Map<ResponseBoMonDto>(newBoMon);
            return monHocDto;
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
            var boMon = await _repositoryMaster.BoMon.GetBoMonByIdAsync(id, false);
            if (boMon is null)
            {
                throw new BoMonNotFoundException(id);
            }
            boMon.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.BoMon.UpdateBoMon(boMon);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa bộ môn thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new BoMonBadRequestException("Không thể xóa bộ môn vì có ràng buộc khóa ngoại!.");         
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task<(IEnumerable<ResponseBoMonDto> data, PageInfo page)> GetAllBoMonAsync(ParamBoMonDto paramBoMonDto)
    {
        var page = paramBoMonDto.page;
        var limit = paramBoMonDto.limit;
        var boMons = await _repositoryMaster.BoMon.GetAllPaginatedAndSearchOrSortAsync(paramBoMonDto.page, paramBoMonDto.limit, paramBoMonDto.search, paramBoMonDto.sortBy, paramBoMonDto.sortByOrder);

        var startIndex = (page - 1) * limit;
        var boMonDto = _mapper.Map<IEnumerable<ResponseBoMonDto>>(boMons)
                .Select((item, index) =>
                {
                    item.STT = startIndex + index + 1;
                    return item;
                });
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
         var boMonExsitting = await _repositoryMaster.BoMon.GetBoMonByIdAsync(id, true);
        if (boMonExsitting is null)
        {
            throw new BoMonNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            boMonExsitting.MaBoMon = _layKyTuHelper.LayKyTuDau(request.TenBoMon);
            boMonExsitting.TenBoMon = request.TenBoMon;
            boMonExsitting.Email = request.Email;
            boMonExsitting.SoDienThoai = request.SoDienThoai;
            boMonExsitting.KhoaId = request.KhoaId;
            boMonExsitting.UpdatedAt = DateTime.Now;
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật bộ môn thành công.");
    }

    public async Task<List<ResponseBoMonDto>> GetBoMonByKhoaIdAsync(Guid khoaId, bool trackChanges)
    {
        var boMonList = await _repositoryMaster.BoMon.GetBoMonByKhoaIdAsync(khoaId, trackChanges);

        if (boMonList is null)
        {
            throw new BoMonNotFoundException(khoaId);
        }

        var boMonDtoList = _mapper.Map<List<ResponseBoMonDto>>(boMonList);
        return boMonDtoList;
    }

    public async Task<IEnumerable<BoMonSummaryDto>> GetAllBoMonNoPageAsync()
    {
        var boMons = await _repositoryMaster.BoMon.GetAllBoMonNoPageAsync();
        var boMonDtos = _mapper.Map<IEnumerable<BoMonSummaryDto>>(boMons);
        return boMonDtos;
    }
}
