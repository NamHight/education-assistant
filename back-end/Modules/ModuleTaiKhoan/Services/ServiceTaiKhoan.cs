using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ThrowErrorTaiKhoans;
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
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceTaiKhoan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseTaiKhoanDto> CreateAsync(RequestAddTaiKhoanDto request)
    {
        if (request is null) throw new TaiKhoanBadRequestException("Thông tin tài khoản không đầy đủ!.");
        var taikhoanExistting = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(request.Email, false);
        if (taikhoanExistting is not null) throw new TaiKhoanExistedException(request.Email);
        request.Password = HashPassword(request.Password);
        var newTaiKhoan = _mapper.Map<TaiKhoan>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            await _repositoryMaster.TaiKhoan.CreateAsync(newTaiKhoan);
        });
        _loggerService.LogInfo("Thêm tài khoản thành công.");
        var taiKhoanDto = _mapper.Map<ResponseTaiKhoanDto>(newTaiKhoan);
        return taiKhoanDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty) throw new TaiKhoanBadRequestException($"Tài khoản với id: {id} không được bỏ trống!.");
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, false);
        if (taiKhoan is null) throw new TaiKhoanNotFoundException(id);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.DeleteTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa tài khoản thành công");
    }

    public async Task<(IEnumerable<ResponseTaiKhoanDto> data, PageInfo page)> GetAllTaiKhoaAsync(
        ParamBaseDto paramBaseDto)
    {
        var taikhoans = await _repositoryMaster.TaiKhoan.GetAllTaiKhoanAsync(paramBaseDto.page, paramBaseDto.limit,
            paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOder);
        var taiKhoaDto = _mapper.Map<IEnumerable<ResponseTaiKhoanDto>>(taikhoans);
        return (data: taiKhoaDto, page: taikhoans!.PageInfo);
    }

    public async Task<ResponseTaiKhoanDto> GetTaiKhoanByIdAsync(Guid id, bool trackChanges)
    {
        if (id == Guid.Empty) throw new TaiKhoanBadRequestException($"Tài khoản với id: {id} không được bỏ trống!.");
        var taikhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, trackChanges);
        if (taikhoan is null) throw new TaiKhoanNotFoundException(id);
        var taiKhoanDto = _mapper.Map<ResponseTaiKhoanDto>(taikhoan);
        return taiKhoanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateTaiKhoanDto request)
    {
        if (id != request.Id)
            throw new TaiKhoanBadRequestException($"Id: {id} và Id: {request.Id} của tài khoản không giống nhau!");
        if (request is null) throw new TaiKhoanBadRequestException("Thông tin tài khoản không đầy đủ");
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, false);
        if (taiKhoan is null) throw new TaiKhoanNotFoundException(id);
        var taiKhoanUpdate = _mapper.Map<TaiKhoan>(request);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoanUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật tài khoản thành công.");
    }


    public async Task UpdateStatusAsync(Guid id)
    {
        if (id == Guid.Empty) throw new TaiKhoanBadRequestException($"Tài khoản với id: {id} không được bỏ trống!.");
        var taikhoanUpdate = await _repositoryMaster.TaiKhoan.GetTaiKhoanByIdAsync(id, false);
        if (taikhoanUpdate is null) throw new TaiKhoanNotFoundException(id);
        taikhoanUpdate.Status = taikhoanUpdate.Status ? false : true;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taikhoanUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật trạng thái tài khoản thành công!");
    }

    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private bool VerifyPassword(string password, string HashPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, HashPassword);
    }
}