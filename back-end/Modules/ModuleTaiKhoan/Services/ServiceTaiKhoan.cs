using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions;
using Education_assistant.Exceptions.ThrowError;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTaiKhoan.Services;

public class ServiceTaiKhoan : IServiceTaiKhoan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceTaiKhoan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseTaiKhoanDto> CreateAsync(RequestTaiKhoanDto request)
    {
        if (request is null)
        {
            // throw new BadRequestException("Tài khoản có thông tin không đầy đủ");
        }
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(request.Id, false);
        if (taiKhoan is not null)
        {
            // throw new ExistedException("Tài khoản đã tồn tại");
        }
        try
        {
            await _repositoryMaster.BeginTransactionAsync();
            var newTaiKhoan = _mapper.Map<TaiKhoan>(request);

            await _repositoryMaster.TaiKhoan.CreateAsync(newTaiKhoan);

            await _repositoryMaster.SaveChangesAsync();
            await _repositoryMaster.CommitTransactionAsync();
            _loggerService.LogInfo("thêm tài khoản giảng viên thành công");
            var taiKhoanDto = _mapper.Map<ResponseTaiKhoanDto>(newTaiKhoan);
            return taiKhoanDto;
        }
        catch (Exception e)
        {
            _loggerService.LogError($"Thêm tài khoản giảng viên không thành công: {e}");
            await _repositoryMaster.RollbackTransactionAsync();
            throw new Exception(e.Message);
        }
    }

    public Task DeleteAsync(Guid id)
    {
        // var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, false);
        // try
        // {

        // }
        // catch (Exception e)
        // {
        //     _loggerService.LogError($"Xóa tài khoản không thành công: {e}");
        //     throw new Exception(e.Message);
        // }
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<(IEnumerable<ResponseTaiKhoanDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamPageAndSearchBaseDto paramBaseDto)
    {
        throw new NotImplementedException();
    }

    public Task<ResponseTaiKhoanDto> GetRoleByIdAsync(int id, bool trackChanges)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(int id, RequestTaiKhoanDto request)
    {
        throw new NotImplementedException();
    }

    public Task UpdateStatusAsync(int id)
    {
        throw new NotImplementedException();
    }
}
