using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.TruongExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Modules.ModuleTruong.Services;

public class ServiceTruong : IServiceTruong
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceTruong(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseTruongDto> CreateAsync(RequestAddTruongDto request)
    {
        if (request is null) throw new TruongBadRequestException("Thông tin trường đầu vào không đủ thông tin!");
        var newTruong = _mapper.Map<Truong>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.Truong.CreateAsync(newTruong);
        });
        _loggerService.LogInfo("Thêm thông tin trường thành công.");
        var taiKhoanDto = _mapper.Map<ResponseTruongDto>(newTruong);
        return taiKhoanDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty) throw new TruongBadRequestException($"Trường với {id} không được bỏ trống!");
        var truong = await _repositoryMaster.Truong.GetTruongByIdAsync(id, false);
        if (truong is null) throw new TruongNotFoundException(id);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Truong.DeleteTruong(truong);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa trường thành công.");
    }


    public async Task<ResponseTruongDto> GetTruongByIdAsync(Guid id, bool trackChanges)
    {
        var truong = await _repositoryMaster.Truong.GetTruongByIdAsync(id, false);
        if (truong is null) throw new TruongNotFoundException(id);
        var truongDto = _mapper.Map<ResponseTruongDto>(truong);
        return truongDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateTruongDto request)
    {
        if (id != request.Id) throw new TruongBadRequestException("Id và Id của trường không giống nhau!");
        if (request is null) throw new TruongBadRequestException("Thông tin trường không đầy đủ!");
        var truong = await _repositoryMaster.Truong.GetTruongByIdAsync(id, false);
        if (truong is null) throw new TruongNotFoundException(id);
        var truongUpdate = _mapper.Map<Truong>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.Truong.UpdateTruong(truongUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật trường thành công.");
    }
}