using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Exceptions.ThrowError.TaiKhoanExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleAuthenticate.Dtos;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceFile;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public sealed class ServiceTaiKhoan : IServiceTaiKhoan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly IPasswordHash _passwordHash;

    public ServiceTaiKhoan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IPasswordHash passwordHash)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _passwordHash = passwordHash;
    }

    public async Task ChangePassword(RequestChangePasswordDto request)
    {
       
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(request.Id, false);
        if (taiKhoan is null)
        {
            throw new TaiKhoanNotFoundException(request.Id);
        }

        var oldPasswordHash = _passwordHash.Hash(request.OldPassword);

        if (!_passwordHash.Verify(request.OldPassword, taiKhoan.Password))
        {
            throw new TaiKhoanBadRequestException($"Mật khẩu cũ của tài khoản {request.Id} không đúng!");
        }

        taiKhoan.Password = _passwordHash.Hash(request.NewPassword);
        taiKhoan.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật mật khẩu thành công.");

    }
}