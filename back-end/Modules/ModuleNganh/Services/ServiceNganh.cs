using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.NganhExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleNganh.DTOs.Param;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleNganh.Services;

public class ServiceNganh : IServiceNganh
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly ILayKyTuHelper _layKyTuHelper;

    public ServiceNganh(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, ILayKyTuHelper layKyTuHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _layKyTuHelper = layKyTuHelper;
    }
    public async Task<ResponseNganhDto> CreateAsync(RequestAddNganhDto request)
    {
        try
        {
            var newNganh = _mapper.Map<Nganh>(request);
            newNganh.MaNganh = _layKyTuHelper.LayKyTuDau(newNganh.TenNganh);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.Nganh.CreateAsync(newNganh);
            });
            _loggerService.LogInfo("Thêm thông tin ngành thành công.");
            var nganhDto = _mapper.Map<ResponseNganhDto>(newNganh);
            return nganhDto;
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
                throw new NganhBadRequestException($"Ngành với {id} không được bỏ trống!");
            }
            var nganh = await _repositoryMaster.Nganh.GetNganhByIdAsync(id, false);
            if (nganh is null)
            {
                throw new NganhNotFoundException(id);
            }
            nganh.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.Nganh.UpdateNganh(nganh);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa ngành thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new NganhBadRequestException("Không thể xóa ngành vì có ràng buộc khóa ngoại!.");
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task<(IEnumerable<ResponseNganhDto> data, PageInfo page)> GetAllNganhAsync(ParamNganhDto paramNganhDto)
    {
        var nganhs = await _repositoryMaster.Nganh.GetAllNganhAsync(paramNganhDto.page, paramNganhDto.limit, paramNganhDto.search, paramNganhDto.sortBy, paramNganhDto.sortByOrder);
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
        try
        {
            if (id != request.Id)
            {
                throw new NganhBadRequestException($"Id: {id} và Id: {request.Id} của ngành không giống nhau!");
            }
            var nganh = await _repositoryMaster.Nganh.GetNganhByIdAsync(id, true);
            if (nganh is null)
            {
                throw new NganhNotFoundException(id);
            }
            
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                nganh.MaNganh = _layKyTuHelper.LayKyTuDau(request.TenNganh);
                nganh.TenNganh = request.TenNganh;
                nganh.MoTa = request.MoTa;
                nganh.KhoaId = request.KhoaId;
                nganh.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật ngành thành công.");
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }
}
