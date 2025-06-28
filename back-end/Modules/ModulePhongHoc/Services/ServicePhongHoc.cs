using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.PhongHocExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Param;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModulePhongHoc.Services;

public class ServicePhongHoc : IServicePhongHoc
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServicePhongHoc(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponsePhongHocDto> CreateAsync(RequestAddPhongHocDto request)
    {
        try
        {
            var newPhongHoc = _mapper.Map<PhongHoc>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.PhongHoc.CreateAsync(newPhongHoc);
            });
            _loggerService.LogInfo("Thêm thông tin phòng học thành công.");
            var phongHocDto = _mapper.Map<ResponsePhongHocDto>(newPhongHoc);
            return phongHocDto;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty) throw new PhongHocBadRequestException($"Phòng học với {id} không được bỏ trống!");
        var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
        if (phongHoc is null) throw new PhongHocNotFoundException(id);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.PhongHoc.DeletePhongHoc(phongHoc);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo($"Xóa phòng học có id = {id} thành công.");
        try
        {
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                                              inner.Contains("reference constraint") ||
                                              inner.Contains("violates foreign key constraint") ||
                                              inner.Contains("cannot delete or update a parent row")))
                throw new PhongHocBadRequestException("Không thể xóa phòng học vì có ràng buộc khóa ngoại!.");
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task<(IEnumerable<ResponsePhongHocDto> data, PageInfo page)> GetAllPhongHocAsync(
        ParamPhongHocDto paramPhongHocDto)
    {
        var phongHocs = await _repositoryMaster.PhongHoc.GetAllPhongHocAsync(paramPhongHocDto.page,
            paramPhongHocDto.limit, paramPhongHocDto.search, paramPhongHocDto.sortBy, paramPhongHocDto.sortByOrder,
            paramPhongHocDto.trangThai);
        var phongHocDto = _mapper.Map<IEnumerable<ResponsePhongHocDto>>(phongHocs);
        return (data: phongHocDto, page: phongHocs!.PageInfo);
    }

    public async Task<ResponsePhongHocDto> GetPhongHocByIdAsync(Guid id, bool trackChanges)
    {
        var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
        if (phongHoc is null) throw new LopHocNotFoundException(id);
        var phongHocDto = _mapper.Map<ResponsePhongHocDto>(phongHoc);
        _loggerService.LogInfo($"Lấy thành công phòng học có id = {phongHocDto.Id}.");
        return phongHocDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdatePhongHocDto request)
    {
        try
        {
            if (id != request.Id) throw new PhongHocBadRequestException("Id request và Id phòng học khác nhau!");
            var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            if (phongHoc is null) throw new PhongHocNotFoundException(id);
            phongHoc.TenPhong = request.TenPhong;
            phongHoc.ToaNha = request.ToaNha;
            phongHoc.SucChua = request.SucChua;
            phongHoc.LoaiPhongHoc = request.LoaiPhongHoc;
            phongHoc.TrangThaiPhongHoc = request.TrangThaiPhongHoc;
            phongHoc.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.PhongHoc.UpdatePhongHoc(phongHoc);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo($"Cập nhật phòng học có id = {id} thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task UpdateTrangThaiAsync(Guid id, int trangThai)
    {
        try
        {
            if (trangThai <= 0 || trangThai >= 4) throw new LopHocBadRequestException("Trạng thái không đúng");
            var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            if (phongHoc is null) throw new PhongHocNotFoundException(id);
            phongHoc.TrangThaiPhongHoc = trangThai;

            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.PhongHoc.UpdatePhongHoc(phongHoc);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo($"Cập nhật trạng thái phòng học có id = {id} thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }
}