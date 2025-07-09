using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;

public class ServiceChiTietChuongTrinhDaoTao : IServiceChiTietChuongTrinhDaoTao
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceChiTietChuongTrinhDaoTao(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseChiTietChuongTrinhDaoTaoDto> CreateAsync(RequestAddChiTietChuongTrinhDaoTaoDto request)
    {
        try
        {
            
            var ctctDaoTaoExisting = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByMonHocIdAndChuongTrinhId(request.MonHocId, request.ChuongTrinhDaoTaoId);
            if (ctctDaoTaoExisting is not null)
            {
                throw new ChiTietChuongTrinhDaoTaoBadRequestException("Môn học đã có trong chương trình đào tạo rồi.");
            }
            var newctctDaoTao = _mapper.Map<ChiTietChuongTrinhDaoTao>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.ChiTietChuongTrinhDaoTao.CreateAsync(newctctDaoTao);
            });
            _loggerService.LogInfo("Thêm thông tin chi tiết chương trình đào tạo thành công");
            var ctctDaoTaoDto = _mapper.Map<ResponseChiTietChuongTrinhDaoTaoDto>(newctctDaoTao);
            return ctctDaoTaoDto;
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
            if (id == Guid.Empty)
            {
                throw new ChiTietChuongTrinhDaoTaoBadRequestException($"Chi tiết chương trình đào tạo với {id} không được bỏ trống!");
            }
            var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
            if (ctctDaoTao is null)
            {
                throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
            }
            ctctDaoTao.DeletedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.ChiTietChuongTrinhDaoTao.UpdateChiTietChuongTrinhDaoTao(ctctDaoTao);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa chi tiết chương trình đào tạo thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new ChiTietChuongTrinhDaoTaoBadRequestException("Không thể xóa chi tiết chương trình đào tạo vì có ràng buộc khóa ngoại!.");         
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task<(IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto> data, PageInfo page)> GetAllChiTietChuongTrinhDaoTaoAsync(ParamChiTietChuongTrinhDaoTaoDto paramChiTietChuongTrinhDaoTaoDto)
    {
        var ctctDaoTaos = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetAllChiTietChuongTrinhDaoTaoAsync(paramChiTietChuongTrinhDaoTaoDto.page, paramChiTietChuongTrinhDaoTaoDto.limit, paramChiTietChuongTrinhDaoTaoDto.search, paramChiTietChuongTrinhDaoTaoDto.sortBy, paramChiTietChuongTrinhDaoTaoDto.sortByOrder, paramChiTietChuongTrinhDaoTaoDto.chuongTrinhDaoTaoId);
        var ctctDaoTaoDtos = _mapper.Map<IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto>>(ctctDaoTaos);
        return (data: ctctDaoTaoDtos, page: ctctDaoTaos!.PageInfo);
    }

    public async Task<IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto>?> GetAllCtctdtByCtdtIdAsync(Guid id, int? hocKy = null)
    {
        var ctctDaoTaos = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetAllCtctdtByCtdtIdAsync(id, hocKy);
        var ctctDaoTaoDtos = _mapper.Map<IEnumerable<ResponseChiTietChuongTrinhDaoTaoDto>>(ctctDaoTaos);
        return ctctDaoTaoDtos;
    }

    public async Task<ResponseChiTietChuongTrinhDaoTaoDto> GetChiTietChuongTrinhDaoTaoByIdAsync(Guid id, bool trackChanges)
    {
        var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, false);
        if (ctctDaoTao is null)
        {
            throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
        }
        var ctctDaoTaoDto = _mapper.Map<ResponseChiTietChuongTrinhDaoTaoDto>(ctctDaoTao);
        return ctctDaoTaoDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChiTietChuongTrinhDaoTaoDto request)
    {
        try
        {
            System.Console.WriteLine($"Request cập nhật: {JsonConvert.SerializeObject(request)}");
            if (id != request.Id)
            {
                throw new ChiTietChuongTrinhDaoTaoBadRequestException($"Id và Id của chi tiết chương trình đào tạo không giống nhau!");
            }
            var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByIdAsync(id, true);
            if (ctctDaoTao is null)
            {
                throw new ChiTietChuongTrinhDaoTaoNotFoundException(id);
            }
            
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                ctctDaoTao.MonHocId = request.MonHocId;
                ctctDaoTao.ChuongTrinhDaoTaoId = request.ChuongTrinhDaoTaoId;
                ctctDaoTao.BoMonId = request.BoMonId;
                ctctDaoTao.SoTinChi = request.SoTinChi;
                ctctDaoTao.HocKy = request.HocKy;
                ctctDaoTao.DiemTichLuy = request.DiemTichLuy;
                ctctDaoTao.LoaiMonHoc = request.LoaiMonHoc;
                ctctDaoTao.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật chi tiết chương trình đào tạo thành công.");
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }
    public async Task<ResponseChiTietChuongTrinhDaoTaoDto> GetChiTietChuongTrinhDaoTaoByMonHocIdAsync(Guid monHocId, bool trackChanges)
    {
        var ctctDaoTao = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByMonHocIdAsync(monHocId, false);
        if (ctctDaoTao is null)
        {
            throw new ChiTietChuongTrinhDaoTaoNotFoundException(monHocId);
        }
        var ctctDaoTaoDto = _mapper.Map<ResponseChiTietChuongTrinhDaoTaoDto>(ctctDaoTao);
        return ctctDaoTaoDto;
    }
}
