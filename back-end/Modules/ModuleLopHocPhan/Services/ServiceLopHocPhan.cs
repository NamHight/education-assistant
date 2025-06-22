using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLopHocPhan.Services;

public class ServiceLopHocPhan : IServiceLopHocPhan
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceLopHocPhan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseLopHocPhanDto> CreateAsync(RequestAddLopHocPhanDto request)
    {
        try
        {
            var ctctdt = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetCtctdtByCtctAndMonHocAsync(request.ChuongTrinhDaoTaoId, request.MonHocId);
            if (ctctdt is null)
            {
                throw new ChiTietChuongTrinhDaoTaoBadRequestException("Môn học chưa được thêm chương trình đào tạo");
            }
            var newLopHocPhan = _mapper.Map<LopHocPhan>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.LopHocPhan.CreateAsync(newLopHocPhan);
            });
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.LopHocPhan.CreateSinhVienLopHocPhanHocBa(request.LopHocId, newLopHocPhan.Id, newLopHocPhan.GiangVienId, newLopHocPhan.MonHocId, ctctdt!.Id, request.HocKy);
            });
            _loggerService.LogInfo("Thêm thông tin lớp học phần thành công.");
            var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(newLopHocPhan);
            return lopHocPhanDto;
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
                throw new LopHocPhanBadRequestException($"Lớp học phần với id: {id} không được bỏ trống!");
            }
            var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.LopHocPhan.DeleteLopHocPhan(lopHocPhan);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa lớp học phần thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                        inner.Contains("reference constraint") ||
                        inner.Contains("violates foreign key constraint") ||
                        inner.Contains("cannot delete or update a parent row")))
            {
                throw new LopHocPhanBadRequestException("Không thể xóa lớp học phần vì có ràng buộc khóa ngoại!.");
            }
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }


    public async Task<(IEnumerable<ResponseLopHocPhanDto> data, PageInfo page)> GetAllLopHocPhanAsync(ParamLopHocPhanDto paramLopHocPhanDto)
    {
        var lopHocPhans = await _repositoryMaster.LopHocPhan.GetAllLopHocPhanAsync(paramLopHocPhanDto.page,
                                                                                paramLopHocPhanDto.limit,
                                                                                paramLopHocPhanDto.search,
                                                                                paramLopHocPhanDto.sortBy,
                                                                                paramLopHocPhanDto.sortByOrder,
                                                                                paramLopHocPhanDto.khoa,
                                                                                paramLopHocPhanDto.loaiChuongTrinh,
                                                                                paramLopHocPhanDto.chuongTrinhId,
                                                                                paramLopHocPhanDto.hocKy,
                                                                                paramLopHocPhanDto.trangThai);
        var lopHocPhanDtos = _mapper.Map<IEnumerable<ResponseLopHocPhanDto>>(lopHocPhans);
        return (data: lopHocPhanDtos, page: lopHocPhans!.PageInfo);
    }

    public async Task<ResponseLopHocPhanDto> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
        if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
        var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(lopHocPhan);
        return lopHocPhanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateLopHocPhanDto request)
    {
        try
        {
            if (id != request.Id)
            throw new LopHocPhanBadRequestException($"Id: {id} và Lớp học phần id: {request.Id} không giống nhau!");
            var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
            var lopHocPhanUpdate = _mapper.Map<LopHocPhan>(request);
            lopHocPhanUpdate.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.LopHocPhan.UpdateLopHocPhan(lopHocPhanUpdate);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật lớp học phần thành công.");
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task UpdateListLophocPhanAsync(List<RequestUpdateLopHocPhanDto> listRequest)
    {
        var lopHocPhans = _mapper.Map<List<LopHocPhan>>(listRequest);
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync<LopHocPhan>(lopHocPhans);
            foreach (var request in listRequest)
                await _repositoryMaster.ChiTietLopHocPhan.UpdateCtlhpWithPhanCongAsync(request.Id, request.GiangVienId,
                    request.MonHocId);
        });
        _loggerService.LogInfo("Cập nhật list phân công giảng viên thành công.");
    }
}