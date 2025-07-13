using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Exceptions.ThrowError.TaiKhoanExceptions;
using Education_assistant.Extensions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleGiangVien.Dtos.Param;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceFile;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public sealed class ServiceGiangVien : IServiceGiangVien
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IPasswordHash _passwordHash;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IServiceFIle _serviceFIle;

    public ServiceGiangVien(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper,
        IPasswordHash passwordHash, IHttpContextAccessor httpContextAccessor, IServiceFIle serviceFIle)
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
                Password = _passwordHash.Hash(newGiangVien.CCCD),
                Status = true,
                LoaiTaiKhoan = request.LoaiTaiKhoan
            };
            await _repositoryMaster.TaiKhoan.CreateAsync(newTaiKhoan);

            newGiangVien.TaiKhoanId = newTaiKhoan.Id;

            await _repositoryMaster.GiangVien.CreateAsync(newGiangVien);
        });
        _loggerService.LogInfo("Thêm thông tin giảng viên thành công.");
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(newGiangVien);
        return giangVienDto;
    }

    public async Task UpdateOptionalAsync(Guid id, RequestUpdateGiangVienOptionDto request)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, true);
        if (giangVien is null) throw new GiangVienNotFoundException(id);
        if (request.File != null && request.File.Length > 0)
        {
            var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "giangvien");
            var context = _httpContextAccessor.HttpContext;
            hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
            giangVien.AnhDaiDien = hinhDaiDien;
        }

        giangVien.UpdatedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            if (!string.IsNullOrWhiteSpace(request.HoTen)) giangVien.HoTen = request.HoTen;
            if (!string.IsNullOrWhiteSpace(request.CCCD)) giangVien.CCCD = request.CCCD;
            giangVien.NgaySinh = request.NgaySinh;
            if (!string.IsNullOrWhiteSpace(request.SoDienThoai)) giangVien.SoDienThoai = request.SoDienThoai;
            if (!string.IsNullOrWhiteSpace(request.DiaChi)) giangVien.DiaChi = request.DiaChi;
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật giảng viên thành công.");
    }

    public async Task DeleteAsync(Guid id)
    {
        var taiKhoanIdUser = _httpContextAccessor.HttpContext!.User.GetUserId();
        if (taiKhoanIdUser == Guid.Empty) throw new TaiKhoanBadRequestException("Thông tin tài khoản id không đầy đủ");
        var giangVienUser = await _repositoryMaster.GiangVien.GetGiangVienByTaiKhoanIdAsync(taiKhoanIdUser, false);
        if (giangVienUser is null) throw new TaiKhoanNotFoundException(taiKhoanIdUser);

        if (id == Guid.Empty) throw new GiangVienBadRequestException($"Khoa với {id} không được bỏ trống!");
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, false);
        if (giangVien is null) throw new GiangVienNotFoundException(id);

        if (giangVienUser.TaiKhoan.LoaiTaiKhoan < giangVien.TaiKhoan.LoaiTaiKhoan)
        {
            if (giangVien.TrangThai != (int)TrangThaiGiangVienEnum.DANG_CONG_TAC)
            {
                giangVien.DeletedAt = DateTime.Now;
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    _repositoryMaster.GiangVien.UpdateGiangVien(giangVien);
                    await Task.CompletedTask;
                });
                _loggerService.LogInfo("Xóa giảng viên thành công.");
            }
            else
            {
                throw new GiangVienBadRequestException("Không thể xóa tài khoản đang ở trạng thái đang công tác");
            }
        }
        else
        {
            throw new GiangVienBadRequestException("Không có quyền xóa tài khoản cùng cấp hay cấp cao hơn");
        }
    }

    public async Task<(IEnumerable<ResponseGiangVienDto> data, PageInfo page)> GetAllGiangVienAsync(
        ParamGiangVienDto paramGiangVienDto)
    {
        var taiKhoanIdUser = _httpContextAccessor.HttpContext!.User.GetUserId();
        if (taiKhoanIdUser == Guid.Empty) throw new TaiKhoanBadRequestException("Thông tin tài khoản id không đầy đủ");
        var giangVienUser = await _repositoryMaster.GiangVien.GetGiangVienByTaiKhoanIdAsync(taiKhoanIdUser, false);
        if (giangVienUser is null) throw new TaiKhoanNotFoundException(taiKhoanIdUser);
        var isAdmin = giangVienUser.TaiKhoan!.LoaiTaiKhoan == (int)LoaiTaiKhoaEnum.ADMIN;
        var khoaGV = Guid.Empty;
        if (!isAdmin) khoaGV = giangVienUser.KhoaId ?? Guid.Empty;
        var giangViens = await _repositoryMaster.GiangVien.GetAllGiangVienAsync(paramGiangVienDto.page,
            paramGiangVienDto.limit, paramGiangVienDto.search, paramGiangVienDto.sortBy, paramGiangVienDto.sortByOrder,
            paramGiangVienDto.KhoaId, paramGiangVienDto.BoMonId, paramGiangVienDto.active, paramGiangVienDto.trangThai,
            paramGiangVienDto.vaiTro, khoaGV);
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
        if (giangVien is null) throw new GiangVienNotFoundException(id);
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        return giangVienDto;
    }

    public async Task<ResponseGiangVienDto> ReStoreGiangVienAsync(Guid id)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienDeleteAsync(id, false);
        if (giangVien is null) throw new GiangVienNotFoundException(id);
        giangVien.DeletedAt = null;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.GiangVien.UpdateGiangVien(giangVien);
            await Task.CompletedTask;
        });
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        return giangVienDto;
    }

    public async Task updateGiangVienStatusAsync(Guid id, int trangThai)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, true);
        if (giangVien is null) throw new GiangVienNotFoundException(id);
        if (trangThai == (int)TrangThaiGiangVienEnum.DANG_CONG_TAC ||
            trangThai == (int)TrangThaiGiangVienEnum.NGHI_VIEC ||
            trangThai == (int)TrangThaiGiangVienEnum.NGHI_HUU)
        {
            giangVien.TrangThai = trangThai;
            giangVien.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.GiangVien.UpdateGiangVien(giangVien);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật trạng thái giảng viên thành công.");
        }
        else
        {
            throw new GiangVienBadRequestException("Trạng thái giảng viên không hợp lệ");
        }
    }

    public async Task UpdateAsync(Guid id, RequestUpdateGiangVienDto request)
    {
        var taiKhoanIdUser = _httpContextAccessor.HttpContext!.User.GetUserId();
        if (taiKhoanIdUser == Guid.Empty) throw new TaiKhoanBadRequestException("Thông tin tài khoản id không đầy đủ");
        var giangVienUser = await _repositoryMaster.GiangVien.GetGiangVienByTaiKhoanIdAsync(taiKhoanIdUser, false);
        if (giangVienUser is null) throw new TaiKhoanNotFoundException(taiKhoanIdUser);

        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(id, true);
        if (giangVien is null) throw new GiangVienNotFoundException(id);
        if (giangVienUser.TaiKhoan.LoaiTaiKhoan < giangVien.TaiKhoan.LoaiTaiKhoan)
        {
            if (request.File != null && request.File.Length > 0)
            {
                var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "giangvien");
                var context = _httpContextAccessor.HttpContext;
                hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
                giangVien.AnhDaiDien = hinhDaiDien;
            }

            giangVien.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                if (!string.IsNullOrWhiteSpace(request.Email)) giangVien.Email = request.Email;
                if (!string.IsNullOrWhiteSpace(request.HoTen)) giangVien.HoTen = request.HoTen;
                if (!string.IsNullOrWhiteSpace(request.CCCD)) giangVien.CCCD = request.CCCD;
                giangVien.NgaySinh = request.NgaySinh;
                giangVien.GioiTinh = request.GioiTinh;
                giangVien.NgayVaoTruong = request.NgayVaoTruong;
                if (!string.IsNullOrWhiteSpace(request.KhoaId.ToString())) giangVien.KhoaId = request.KhoaId;
                if (!string.IsNullOrWhiteSpace(request.BoMonId.ToString())) giangVien.BoMonId = request.BoMonId;
                if (!string.IsNullOrWhiteSpace(request.SoDienThoai)) giangVien.SoDienThoai = request.SoDienThoai;
                if (!string.IsNullOrWhiteSpace(request.DiaChi)) giangVien.DiaChi = request.DiaChi;
                if (!string.IsNullOrWhiteSpace(request.TrinhDo)) giangVien.TrinhDo = request.TrinhDo;
                if (!string.IsNullOrWhiteSpace(request.ChuyenNganh)) giangVien.ChuyenNganh = request.ChuyenNganh;
                if (request.ChucVu is not null) giangVien.ChucVu = request.ChucVu;
                if (request.TrangThai is not null) giangVien.TrangThai = request.TrangThai;
                if (request.LoaiTaiKhoan is not null) giangVien.TaiKhoan.LoaiTaiKhoan = request.LoaiTaiKhoan;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật giảng viên thành công.");
        }
    }

    public async Task<IEnumerable<GiangVienSummaryDto>?> GetAllGiangVienByBoMonAsync(Guid boMonId)
    {
        var giangViens = await _repositoryMaster.GiangVien.GetAllGiangVienByBoMonAsync(boMonId);
        var giangVienDtos = _mapper.Map<IEnumerable<GiangVienSummaryDto>>(giangViens);
        return giangVienDtos;
    }

    public async Task<IEnumerable<ResponseGiangVienDto>?> GetAllGiangVienNoPageAsync()
    {
        var giangViens = await _repositoryMaster.GiangVien.GetAllGiangVienNoPageAsync();
        var giangVienDtos = _mapper.Map<IEnumerable<ResponseGiangVienDto>>(giangViens);
        return giangVienDtos;
    }

    public async Task<ResponseGiangVienSummaryDto> GetAllGiangVienSummaryAsync(Guid khoaId)
    {
        var tongSoGiangVien = await _repositoryMaster.GiangVien.GetAllTongSoLuongGiangVienAsync(khoaId);
        var dangCongTac = await _repositoryMaster.GiangVien.GetAllTrangThainDangCongTacAsync(khoaId);
        var nghiViec = await _repositoryMaster.GiangVien.GetAllTrangThaiNghiViecAsync(khoaId);
        var nghiHuu = await _repositoryMaster.GiangVien.GetAllTrangThaiNghiViecAsync(khoaId);

        var chucVuGiangVien = await _repositoryMaster.GiangVien.GetAllChucVuGiangVienAsync(khoaId);
        var chucVuGiangVienChinh = await _repositoryMaster.GiangVien.GetAllChucVuGiangVienChinhAsync(khoaId);
        var chucVuTruongBoMon = await _repositoryMaster.GiangVien.GetAllChucVuTruongBoMonAsync(khoaId);
        var chucVuTruongKhoa = await _repositoryMaster.GiangVien.GetAllChucVuTruongKhoaAsync(khoaId);

        var dataGiangVien = new ResponseGiangVienSummaryDto
        {
            TongSoGiangVien = tongSoGiangVien,
            DangCongTac = dangCongTac,
            NghiViec = nghiViec,
            NghiHuu = nghiHuu,

            ChucVuGiangVien = chucVuGiangVien,
            ChucVuGiangVienChinh = chucVuGiangVienChinh,
            ChucVuTruongBoMon = chucVuTruongBoMon,
            ChucVuTruongKhoa = chucVuTruongKhoa
        };
        return dataGiangVien;
    }
}