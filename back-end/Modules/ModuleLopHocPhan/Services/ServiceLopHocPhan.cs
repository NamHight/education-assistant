using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHocPhan.Services;

public class ServiceLopHocPhan : IServiceLopHocPhan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceLopHocPhan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponseLopHocPhanDto> CreateAsync(RequestAddLopHocPhanDto request)
    {
        var newLopHocPhan = _mapper.Map<LopHocPhan>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.LopHocPhan.CreateAsync(newLopHocPhan);
        });
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.LopHocPhan.CreateSinhVienLopHocPhan(request.LopHocId, newLopHocPhan.Id, newLopHocPhan.GiangVienId, newLopHocPhan.MonHocId, request.HocKy);
        });
        _loggerService.LogInfo("Thêm thông tin lớp học phần thành công.");
        var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(newLopHocPhan);
        return lopHocPhanDto;
    }


    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new LopHocPhanBadRequestException($"Lớp học phần với id: {id} không được bỏ trống!");
        }
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
        if (lopHocPhan is null)
        {
            throw new LopHocPhanNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.LopHocPhan.DeleteLopHocPhan(lopHocPhan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa lớp học phần thành công.");
    }

    public async Task<(IEnumerable<ResponseLopHocPhanDto> data, PageInfo page)> GetAllLopHocPhanAsync(ParamBaseDto paramBaseDto)
    {
        var lopHocPhans = await _repositoryMaster.LopHocPhan.GetAllLopHocPhanAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var lopHocPhanDtos = _mapper.Map<IEnumerable<ResponseLopHocPhanDto>>(lopHocPhans);
        return (data: lopHocPhanDtos, page: lopHocPhans!.PageInfo);
    }

    public async Task<ResponseLopHocPhanDto> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
        if (lopHocPhan is null)
        {
            throw new LopHocPhanNotFoundException(id);
        }
        var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(lopHocPhan);
        return lopHocPhanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateLopHocPhanDto request)
    {
        if (id != request.Id)
        {
            throw new LopHocPhanBadRequestException($"Id: {id} và Lớp học phần id: {request.Id} không giống nhau!");
        }
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
        if (lopHocPhan is null)
        {
            throw new LopHocPhanNotFoundException(id);
        }
        var lopHocPhanUpdate = _mapper.Map<LopHocPhan>(request);
        lopHocPhanUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.LopHocPhan.UpdateLopHocPhan(lopHocPhanUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật lớp học phần thành công.");
    }
}
