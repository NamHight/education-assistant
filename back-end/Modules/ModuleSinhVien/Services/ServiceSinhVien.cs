using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Exceptions.ThrowError.SinhVienExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Param;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceFile;

namespace Education_assistant.Modules.ModuleSinhVien.Services;

public class ServiceSinhVien : IServiceSinhVien
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly IServiceFIle _serviceFIle;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ServiceSinhVien(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IHttpContextAccessor httpContextAccessor, IServiceFIle serviceFIle)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _serviceFIle = serviceFIle;
    }
    public async Task<ResponseSinhVienDto> CreateAsync(RequestAddSinhVienDto request)
    {
        var newSinhVien = _mapper.Map<SinhVien>(request);
        if (request.File != null && request.File.Length > 0)
        {
            var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "sinhvien");
            var context = _httpContextAccessor.HttpContext;
            hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
            newSinhVien.AnhDaiDien = hinhDaiDien;
        }

        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.SinhVien.CreateAsync(newSinhVien);
        });
        _loggerService.LogInfo("Thêm thông tin sinh viên thành công.");
        var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(newSinhVien);
        return sinhVienDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new SinhVienBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, false);
        if (sinhVien is null)
        {
            throw new SinhVienNotFoundException(id);
        }
        sinhVien.DeletedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.SinhVien.UpdateSinhVien(sinhVien);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa sinh viên thành công.");
    }

    public async Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienAsync(ParamBaseDto paramBaseDto)
    {
        var sinhViens = await _repositoryMaster.SinhVien.GetAllSinhVienAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var sinhVienDtos = _mapper.Map<IEnumerable<ResponseSinhVienDto>>(sinhViens);
        return (data: sinhVienDtos, page: sinhViens!.PageInfo);
    }

    public async Task<(IEnumerable<ResponseSinhVienDto> data, PageInfo page)> GetAllSinhVienByLopIdAsync(ParamSinhVienByLopDto paramBaseDto)
    {
        var sinhViens = await _repositoryMaster.SinhVien.GetAllSinhVienByIdLopAsync(paramBaseDto.lopId, paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var sinhVienDtos = _mapper.Map<IEnumerable<ResponseSinhVienDto>>(sinhViens);
        return (data: sinhVienDtos, page: sinhViens!.PageInfo);
    }

    public async Task<ResponseSinhVienDto> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, false);
        if (sinhVien is null)
        {
            throw new SinhVienNotFoundException(id);
        }
        var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(sinhVien);
        return sinhVienDto;
    }

    public async Task<ResponseSinhVienDto> ReStoreSinhVienAsync(Guid id)
    {
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienDeleteAsync(id, false);
        if (sinhVien is null)
        {
            throw new SinhVienNotFoundException(id);
        }
        sinhVien.DeletedAt = null;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.SinhVien.UpdateSinhVien(sinhVien);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Restore sinh viên thành công");
        var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(sinhVien);
        return sinhVienDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateSinhVienDto request)
    {
        if (id != request.Id)
        {
            throw new SinhVienBadRequestException($"Id: {id} và Id: {request.Id} của giảng viên không giống nhau!");
        }
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, false);
        if (sinhVien is null)
        {
            throw new GiangVienNotFoundException(id);
        }
        var sinhVienUpdate = _mapper.Map<SinhVien>(request);
        if (request.File != null && request.File.Length > 0)
        {
            var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "sinhvien");
            var context = _httpContextAccessor.HttpContext;
            hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
            sinhVienUpdate.AnhDaiDien = hinhDaiDien;
        }
        sinhVienUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.SinhVien.UpdateSinhVien(sinhVienUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật sinh viên thành công.");
    }
}
