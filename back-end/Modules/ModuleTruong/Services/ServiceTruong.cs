using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.TruongExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceFile;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleTruong.Services;

public class ServiceTruong : IServiceTruong
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IServiceFIle _serviceFIle;

    public ServiceTruong(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IServiceFIle serviceFIle, IHttpContextAccessor httpContextAccessor)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _serviceFIle = serviceFIle;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ResponseTruongDto> CreateAsync(RequestAddTruongDto request)
    {
        try
        {
            var newTruong = _mapper.Map<Truong>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.Truong.CreateAsync(newTruong);
            });
            _loggerService.LogInfo("Thêm thông tin trường thành công.");
            var taiKhoanDto = _mapper.Map<ResponseTruongDto>(newTruong);
            return taiKhoanDto;
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
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

    public async Task<IEnumerable<ResponseTruongDto>> GetAllTruongAsync()
    {
        var truongs = await _repositoryMaster.Truong.GetAllTruongAsync();
        var truongDtos = _mapper.Map<IEnumerable<ResponseTruongDto>>(truongs);
        return truongDtos;
    }

    public async Task<Dictionary<string, string>> GetTruongAsync()
    {
        return await _repositoryMaster.Truong.GetTruongAsync(false);
    }
    public async Task<ResponseTruongDto> GetTruongByIdAsync(Guid id, bool trackChanges)
    {
        var truong = await _repositoryMaster.Truong.GetTruongByIdAsync(id, false);
        if (truong is null) throw new TruongNotFoundException(id);
        var truongDto = _mapper.Map<ResponseTruongDto>(truong);
        return truongDto;
    }

    public async Task ImportFileImageTruongAsync(RequestUpdateFileTruongDto requestUpdateFileDto)
    {
        try
        {
            var truong = await _repositoryMaster.Truong.GetTruongByIdAsync(requestUpdateFileDto.Id, false);
            if (truong is null)
            {
                throw new TruongNotFoundException(requestUpdateFileDto.Id);
            }
            if (requestUpdateFileDto.File != null && requestUpdateFileDto.File.Length > 0)  
            {
                var hinhDaiDien = await _serviceFIle.UpLoadFile(requestUpdateFileDto.File!, "truong");
                var context = _httpContextAccessor.HttpContext;
                hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
                truong!.Value = hinhDaiDien;
                truong.UpdatedAt = DateTime.Now;
            }
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.Truong.UpdateTruong(truong);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Thêm hình ảnh thành công");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task UpdateAsync(Guid id, RequestUpdateTruongDto request)
    {
        try
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
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }
}