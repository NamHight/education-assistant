using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.MonHocExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Param;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleMonHoc.Services;

public class ServiceMonHoc : IServiceMonHoc
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly ILayKyTuHelper _layKyTuHelper;
    public ServiceMonHoc(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, ILayKyTuHelper layKyTuHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _layKyTuHelper = layKyTuHelper;
    }
    public async Task<ResponseMonHocDto> CreateAsync(RequestAddMonHocDto request)
    {
        try
        {
            if (request is null)
            {
                throw new MonHocBadRequestException("Thông tin bộ môn đầu vào không đủ thông tin!");
            }
            var newMonHoc = _mapper.Map<MonHoc>(request);
            newMonHoc.MaMonHoc = _layKyTuHelper.LayKyTuDau(request.TenMonHoc);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.MonHoc.CreateAsync(newMonHoc);
            });
            _loggerService.LogInfo("Thêm thông tin bộ môn thành công.");
            var monHocDto = _mapper.Map<ResponseMonHocDto>(newMonHoc);
            return monHocDto; 
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        try
        {
            if (id == Guid.Empty)
            {
                throw new MonHocBadRequestException($"Môn học với {id} không được bỏ trống!");
            }
            var monHoc = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(id, false);
            if (monHoc is null)
            {
                throw new MonHocNotFoundException(id);
            }
            monHoc.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.MonHoc.UpdateMonHoc(monHoc);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa môn học thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new MonHocBadRequestException("Không thể xóa môn học vì có ràng buộc khóa ngoại!.");
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task<(IEnumerable<ResponseMonHocDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamMonHocDto paramMonHocDto)
    {
        var monHocs = await _repositoryMaster.MonHoc.GetAllPaginatedAndSearchOrSortAsync(paramMonHocDto.page, paramMonHocDto.limit, paramMonHocDto.search, paramMonHocDto.sortBy, paramMonHocDto.sortByOrder);
        var monHocDto = _mapper.Map<IEnumerable<ResponseMonHocDto>>(monHocs);
        return (data: monHocDto, page: monHocs!.PageInfo);
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
        try
        {
            if (id != request.Id)
            {
                throw new MonHocBadRequestException($"Id và Id của môn học không giống nhau!");
            }
            var monHoc = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(id, true);
            if (monHoc is null)
            {
                throw new MonHocNotFoundException(id);
            }
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                monHoc.MaMonHoc = _layKyTuHelper.LayKyTuDau(request.TenMonHoc);
                monHoc.TenMonHoc = request.TenMonHoc;
                monHoc.MoTa = request.MoTa;
                monHoc.KhoaId = request.KhoaId;
                monHoc.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật môn học thành công.");
        } catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task<List<ResponseMonHocDto>> GetMonHocByKhoaIdAsync(Guid khoaId, bool trackChanges)
    {
        var monHoc = await _repositoryMaster.MonHoc.GetMonHocByKhoaIdAsync(khoaId, false);
        if (monHoc is null)
        {
            throw new MonHocNotFoundException(khoaId);
        }
        var monHocDto = _mapper.Map<List<ResponseMonHocDto>>(monHoc);
        return monHocDto;
    }
}
