using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;

public class ServiceChiTietLopHocPhan : IServiceChiTietLopHocPhan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceChiTietLopHocPhan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseChiTietLopHocPhanDto> CreateAsync(RequestAddChiTietLopHocPhanDto request)
    {
        var newDiemSo = _mapper.Map<ChiTietLopHocPhan>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.ChiTietLopHocPhan.CreateAsync(newDiemSo);
        });
        _loggerService.LogInfo("Thêm thông tin chi tiết lớp học phần thành công.");
        var diemSoDto = _mapper.Map<ResponseChiTietLopHocPhanDto>(newDiemSo);
        return diemSoDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        var diemSo = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
        if (diemSo is null)
        {
            throw new ChiTietLopHocPhanNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChiTietLopHocPhan.DeleteChiTietLopHocPhan(diemSo);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa chi tiết lớp học phần thành công.");
    }

    public async Task<(IEnumerable<ResponseChiTietLopHocPhanDto> data, PageInfo page)> GetAllChiTietLopHocPhanAsync(ParamBaseDto paramBaseDto)
    {
        var diemSos = await _repositoryMaster.ChiTietLopHocPhan.GetAllChiTietLopHocPhanAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var diemSoDto = _mapper.Map<IEnumerable<ResponseChiTietLopHocPhanDto>>(diemSos);
        return (data: diemSoDto, page: diemSos!.PageInfo);
    }

    public async Task<ResponseChiTietLopHocPhanDto> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        var diemSo = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
        if (diemSo is null)
        {
            throw new ChiTietLopHocPhanNotFoundException(id);
        }
        var diemSoDto = _mapper.Map<ResponseChiTietLopHocPhanDto>(diemSo);
        return diemSoDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChiTietLopHocPhanDto request)
    {
        if (id != request.Id)
        {
            throw new ChiTietLopHocPhanBadRequestException($"Id: {id} và Id: {request.Id} của bộ môn không giống nhau!");
        }
         var diemSoExstting = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
        if (diemSoExstting is null)
        {
            throw new ChiTietLopHocPhanNotFoundException(id);
        }
        var diemSoUpdate = _mapper.Map<ChiTietLopHocPhan>(request);
        diemSoUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.ChiTietLopHocPhan.UpdateChiTietLopHocPhan(diemSoUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật chi tiết lớp học phần thành công.");
    }

    public async Task UpdateListChiTietLopHocPhanAsync(List<RequestUpdateChiTietLopHocPhanDto> listRequest)
    {
        var diemSos = _mapper.Map<List<ChiTietLopHocPhan>>(listRequest);
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync<ChiTietLopHocPhan>(diemSos);
        });
        _loggerService.LogInfo("Cập nhật điểm hàng loại thành công thành công.");
    }
}
