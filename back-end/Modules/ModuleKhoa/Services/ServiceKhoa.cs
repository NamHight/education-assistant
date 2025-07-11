using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.KhoaExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleKhoa.DTOs.Param;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleKhoa.Services;

public class ServiceKhoa : IServiceKhoa
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceKhoa(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseKhoaDto> CreateAsync(RequestAddKhoaDto request)
    {
        try
        {
            var newKhoa = _mapper.Map<Khoa>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.Khoa.CreateAsync(newKhoa);
            });
            _loggerService.LogInfo("Thêm thông tin khoa thành công.");
            var khoaDto = _mapper.Map<ResponseKhoaDto>(newKhoa);
            return khoaDto;
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
            if (id == Guid.Empty) throw new KhoaBadRequestException($"Khoa với {id} không được bỏ trống!");
            var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, false);
            if (khoa is null) throw new KhoaNotFoundException(id);
            khoa.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.Khoa.UpdateKhoa(khoa);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa khoa thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                                              inner.Contains("reference constraint") ||
                                              inner.Contains("violates foreign key constraint") ||
                                              inner.Contains("cannot delete or update a parent row")))
                throw new KhoaBadRequestException("Không thể xóa khoa vì có ràng buộc khóa ngoại!.");
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task<IEnumerable<ResponseKhoaDto>> GetAllKhoaNoPageAsync()
    {
        var khoas = await _repositoryMaster.Khoa.GetAllKhoaNoPageAsync(); 
        var khoaDtos = _mapper.Map<IEnumerable<ResponseKhoaDto>>(khoas);
        return khoaDtos;
    }

    public async Task<(IEnumerable<ResponseKhoaDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(
        ParamKhoaDto paramKhoaDto)
    {
        var page = paramKhoaDto.page;
        var limit = paramKhoaDto.limit;
        var khoas = await _repositoryMaster.Khoa.GetAllPaginatedAndSearchOrSortAsync(paramKhoaDto.page,
            paramKhoaDto.limit, paramKhoaDto.search, paramKhoaDto.sortBy, paramKhoaDto.sortByOrder);

        var startIndex = (page - 1) * limit;
        var khoaDto = _mapper.Map<IEnumerable<ResponseKhoaDto>>(khoas)
                .Select((item, index) =>
                {
                    item.STT = startIndex + index + 1;
                    return item;
                });
        return (data: khoaDto, page: khoas!.PageInfo);
    }

    public async Task<ResponseKhoaDto> GetKhoaByIdAsync(Guid id, bool trackChanges)
    {
        var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, false);
        if (khoa is null) throw new KhoaNotFoundException(id);
        var khoaDto = _mapper.Map<ResponseKhoaDto>(khoa);
        return khoaDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateKhoaDto request)
    {
        try
        {
            if (id != request.Id)
                throw new KhoaBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
            var khoa = await _repositoryMaster.Khoa.GetKhoaByIdAsync(id, true);
            if (khoa is null) throw new KhoaNotFoundException(id);
            
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                khoa.TenKhoa = request.TenKhoa;
                khoa.SoDienThoai = request.SoDienThoai;
                khoa.Email = request.Email;
                khoa.ViTriPhong = request.ViTriPhong;
                khoa.Website = request.Website;
                khoa.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật khoa thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }
}