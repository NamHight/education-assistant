using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleGiangVien.Dtos.Param;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Education_assistant.Services.ServiceFile;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public sealed class ServiceGiangVien : IServiceGiangVien
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly IPasswordHash _passwordHash;
    private readonly IServiceFIle _serviceFIle;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ServiceGiangVien(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IPasswordHash passwordHash, IHttpContextAccessor httpContextAccessor, IServiceFIle serviceFIle)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _passwordHash = passwordHash;
        _httpContextAccessor = httpContextAccessor;
        _serviceFIle = serviceFIle;
    }
    public async Task<ResponseGiangVienDto> CreateAsync(RequestAddGiangVienDto request)
    {
        var newGiangVien = _mapper.Map<GiangVien>(request);
        if (request.File != null && request.File.Length > 0)
        {
            var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "giangvien");
            var context = _httpContextAccessor.HttpContext;
            hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
            newGiangVien.AnhDaiDien = hinhDaiDien;
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            var newTaiKhoan = new TaiKhoan
            {
                Email = newGiangVien.Email,
                Password = _passwordHash.Hash("Admin@123"),
                Status = true,
                LoaiTaiKhoan = request.LoaiTaiKhoan,
            };
            await _repositoryMaster.TaiKhoan.CreateAsync(newTaiKhoan);

            newGiangVien.TaiKhoanId = newTaiKhoan.Id;

            await _repositoryMaster.GiangVien.CreateAsync(newGiangVien);
        });
        _loggerService.LogInfo("Thêm thông tin giảng viên thành công.");
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(newGiangVien);
        return giangVienDto;
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new GiangVienBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        if (giangVien is null)
        {
            throw new GiangVienNotFoundException(id);
        }
        giangVien.DeletedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.GiangVien.UpdateGiangVien(giangVien);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa giảng viên thành công.");
    }

    public async Task<(IEnumerable<ResponseGiangVienDto> data, PageInfo page)> GetAllGiangVienAsync(ParamGiangVienDto paramGiangVienDto)
    {
        var giangViens = await _repositoryMaster.GiangVien.GetAllGiangVienAsync(paramGiangVienDto.page, paramGiangVienDto.limit, paramGiangVienDto.search, paramGiangVienDto.sortBy, paramGiangVienDto.sortByOrder, paramGiangVienDto.KhoaId, paramGiangVienDto.BoMonId);
        var giangVienDtos = _mapper.Map<IEnumerable<ResponseGiangVienDto>>(giangViens);
        return (data: giangVienDtos, page: giangViens!.PageInfo);
    }

    public async Task<IEnumerable<ResponseGiangVienDto>?> GetAllGiangVienByKhoa(Guid khoaId)
    {
        var giangViens = await _repositoryMaster.GiangVien.GetAllGiangVienByKhoa(khoaId);
        var giangVienDtos = _mapper.Map<IEnumerable<ResponseGiangVienDto>>(giangViens);
        return giangVienDtos;
    }

    public async Task<ResponseGiangVienDto> GetGiangVienByIdAsync(Guid id, bool trackChanges)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        if (giangVien is null)
        {
            throw new GiangVienNotFoundException(id);
        }
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        return giangVienDto;
    }

    public async Task<ResponseGiangVienDto> ReStoreGiangVienAsync(Guid id)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienDeleteAsync(id, false);
        if (giangVien is null)
        {
            throw new GiangVienNotFoundException(id);
        }
        giangVien.DeletedAt = null;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.GiangVien.UpdateGiangVien(giangVien);
            await Task.CompletedTask;
        });
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        return giangVienDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateGiangVienDto request)
    {
        if (id != request.Id)
        {
            throw new GiangVienBadRequestException($"Id: {id} và Id: {request.Id} của giảng viên không giống nhau!");
        }
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        if (giangVien is null)
        {
            throw new GiangVienNotFoundException(id);
        }
        var giangVienUpdate = _mapper.Map<GiangVien>(request);
        if (request.File != null && request.File.Length > 0)
        {
            var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "giangvien");
            var context = _httpContextAccessor.HttpContext;
            hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
            giangVienUpdate.AnhDaiDien = hinhDaiDien;
        }
        giangVienUpdate.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.GiangVien.UpdateGiangVien(giangVienUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật giảng viên thành công.");

    }
}