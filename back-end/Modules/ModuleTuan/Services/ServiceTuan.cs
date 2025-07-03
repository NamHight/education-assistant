using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.TuanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTuan.DTOs.Param;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Modules.ModuleTuan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

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
        try
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
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task CreateAutoTuanForNamHocAsnyc(int namHoc)
    {
        if (namHoc < 1900)
        {
            return;
        }
        if (await _repositoryMaster.Tuan.HasTuanForNamHocAsync(namHoc))
        {
            return;
        }
        try
        {
            var tuans = new List<Tuan>();
            var startDate = new DateTime(namHoc, 1, 1);
            for (int i = 1; i <= 52; i++)
            {
                var start = startDate.AddDays((i - 1) * 7);
                var end = start.AddDays(6);
                tuans.Add(new Tuan
                {
                    SoTuan = i,
                    NamHoc = namHoc,
                    NgayBatDau = start,
                    NgayKetThuc = end,
                    CreatedAt = DateTime.UtcNow,
                });
            }
            await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
            {
                await _repositoryMaster.BulkAddEntityAsync<Tuan>(tuans);
            });
        }
        catch (Exception ex)
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
        }catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new TuanBadRequestException("Không thể xóa tuần vì có ràng buộc khóa ngoại!.");         
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task<(IEnumerable<ResponseTuanDto> data, PageInfo page)> GetAllTuanAsync(ParamTuanDto paramTuanDto)
    {
        var tuans = await _repositoryMaster.Tuan.GetAllTuanAsync(paramTuanDto.page, paramTuanDto.limit, paramTuanDto.search, paramTuanDto.sortBy, paramTuanDto.sortByOrder, paramTuanDto.namHoc);
        var tuanDtos = _mapper.Map<IEnumerable<ResponseTuanDto>>(tuans);
        return (data: tuanDtos, page: tuans!.PageInfo);
    }

    public async Task<IEnumerable<ResponseTuanDto>> GetALLTuanByNamHocAsync(int namHoc)
    {
        var tuans = await _repositoryMaster.Tuan.GetALLTuanByNamHocAsync(namHoc);
        var tuanDtos = _mapper.Map<IEnumerable<ResponseTuanDto>>(tuans);
        return tuanDtos;
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

    public async Task<IEnumerable<ResponseTuanDto>> GetTuanComboBoxAsync(ParamTuanCopyDto paramTuanDto)
    {
        var tuan = await _repositoryMaster.Tuan.GetTuanByIdAsync(paramTuanDto.TuanBatDauId, false);
        var tuanBatDau = 0;
        if (tuan is not null)
        {
            tuanBatDau = tuan.SoTuan;
        }
        var tuans = await _repositoryMaster.Tuan.GetTuanComboBoxAsync(paramTuanDto.NamHoc, tuanBatDau, paramTuanDto.GiangVienId);
        var tuanDto = _mapper.Map<IEnumerable<ResponseTuanDto>>(tuans);
        return tuanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateTuanDto request)
    {
        try
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
            tuan.SoTuan = request.SoTuan;
            tuan.NamHoc = request.NamHoc;
            tuan.NgayBatDau = request.NgayBatDau;
            tuan.NgayKetThuc = request.NgayKetThuc;
            tuan.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.Tuan.UpdateTuan(tuan);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật tuần thành công.");
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }
}
