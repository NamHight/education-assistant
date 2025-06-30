using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.SinhVienExceptions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Param;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceFile;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Services;

public class ServiceSinhVien : IServiceSinhVien
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IServiceFIle _serviceFIle;

    public ServiceSinhVien(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper,
        IHttpContextAccessor httpContextAccessor, IServiceFIle serviceFIle)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _serviceFIle = serviceFIle;
    }

    public async Task<ResponseSinhVienDto> CreateAsync(RequestAddSinhVienDto request)
    {
        var exsitingSinhVien = await _repositoryMaster.SinhVien.GetSinhVienByMssvOrCccdAsync(request.MSSV, request.CCCD);
        if (exsitingSinhVien != null)
        {
            throw new SinhVienBadRequestException("Mssv hoặc cccd đã tồn tại");
        }
        try
        {
            var newSinhVien = _mapper.Map<SinhVien>(request);
            if (request.File != null && request.File.Length > 0)
            {
                var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "sinhvien");
                var context = _httpContextAccessor.HttpContext;
                hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
                newSinhVien.AnhDaiDien = hinhDaiDien;
            }

            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.SinhVien.CreateAsync(newSinhVien);
            });
            _loggerService.LogInfo("Thêm thông tin sinh viên thành công.");
            var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(newSinhVien);
            return sinhVienDto;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty) throw new SinhVienBadRequestException($"Khoa với {id} không được bỏ trống!");
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, false);
        if (sinhVien is null) throw new SinhVienNotFoundException(id);
        sinhVien.DeletedAt = DateTime.Now;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.SinhVien.UpdateSinhVien(sinhVien);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa sinh viên thành công.");
    }

    public async Task<(ResponseSinhVienSummaryDto data, PageInfo page)> GetAllSinhVienAsync(
        ParamSinhVienDto paramSinhVienDto)
    {
        var sinhViens = await _repositoryMaster.SinhVien.GetAllSinhVienAsync(paramSinhVienDto.page,
            paramSinhVienDto.limit, paramSinhVienDto.search, paramSinhVienDto.sortBy, paramSinhVienDto.sortByOrder,
            paramSinhVienDto.lopId, paramSinhVienDto.tinhTrangHocTap);

        var tongSo = await _repositoryMaster.SinhVien.GetAllTongSoAsync(paramSinhVienDto.lopId);
        var soXuatSac = await _repositoryMaster.SinhVien.GetAllSoXuatSacAsync(paramSinhVienDto.lopId);
        var soKha = await _repositoryMaster.SinhVien.GetAllSoKhaAsync(paramSinhVienDto.lopId);
        var SoCanCaiThien = await _repositoryMaster.SinhVien.GetAllSoCanCaiThienAsync(paramSinhVienDto.lopId);

        var soDangHoc = await _repositoryMaster.SinhVien.GetAllSoDangHocAsync(paramSinhVienDto.lopId);
        var soDaTotNghiep = await _repositoryMaster.SinhVien.GetAllSoDaTotNghiepAsync(paramSinhVienDto.lopId);
        var SoTamNghi = await _repositoryMaster.SinhVien.GetAllSoTamNghiAsync(paramSinhVienDto.lopId);

        

        var sinhVienDtos = _mapper.Map<IEnumerable<ResponseSinhVienTinhTrangHocTapDto>>(sinhViens);
        foreach (var svDto in sinhVienDtos)
        {
            var gpa = await _repositoryMaster.HocBa.TinhGPAAsync(svDto.Id);
            var diemDanh = await _repositoryMaster.ChiTietLopHocPhan.TinhPhanTramChuyenCanAsync(svDto.Id);

            svDto.GPA = gpa ?? 0;
            svDto.DiemDanh = diemDanh;
        }

        var dataSinhVien = new ResponseSinhVienSummaryDto
        {
            TongSoSinhVien = tongSo,
            SoXuatSac = soXuatSac,
            SoKha = soKha,
            SoCanCaiThien = SoCanCaiThien,

            SoDangHoc = soDangHoc,
            SoDaTotNghiep = soDaTotNghiep,
            SoTamNghi = SoTamNghi,

            DanhSachSinhVien = sinhVienDtos,
        };

        return (data: dataSinhVien, page: sinhViens!.PageInfo);
    }


    public async Task<ResponseSinhVienDto> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, false);
        if (sinhVien is null) throw new SinhVienNotFoundException(id);
        var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(sinhVien);
        return sinhVienDto;
    }

    public async Task ImportFileExcelAsync(RequestImportFileSinhVienDto request)
    {
        var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(request.lopHocId, false);
        if (lopHoc is null)
        {
            throw new LopHocNotFoundException(request.lopHocId);
        }
        if (request.File == null || request.File.Length == 0)
        {
            throw new ArgumentException("File không được để trống hoặc rỗng.");
        }
        try
        {
            
        }catch (Exception ex)
        {
            throw new Exception($"Lỗi hệ thống import file: {ex.Message}");
        }
    }

    public async Task<ResponseSinhVienDto> ReStoreSinhVienAsync(Guid id)
    {
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienDeleteAsync(id, false);
        if (sinhVien is null) throw new SinhVienNotFoundException(id);
        sinhVien.DeletedAt = null;
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.SinhVien.UpdateSinhVien(sinhVien);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Restore sinh viên thành công");
        var sinhVienDto = _mapper.Map<ResponseSinhVienDto>(sinhVien);
        return sinhVienDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateSinhVienDto request)
    {
        try
        {
            if (id != request.Id)
                throw new SinhVienBadRequestException($"Id: {id} và Id: {request.Id} của giảng viên không giống nhau!");
            var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByIdAsync(id, true);
            if (sinhVien is null) throw new GiangVienNotFoundException(id);
            if (request.File != null && request.File.Length > 0)
            {
                var hinhDaiDien = await _serviceFIle.UpLoadFile(request.File!, "sinhvien");
                var context = _httpContextAccessor.HttpContext;
                hinhDaiDien = $"{context!.Request.Scheme}://{context.Request.Host}/uploads/{hinhDaiDien}";
                sinhVien.AnhDaiDien = hinhDaiDien;
            }

            sinhVien.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                if (request.TrangThaiSinhVienEnum is not null)
                    sinhVien.TrangThaiSinhVien = request.TrangThaiSinhVienEnum;
                if (!string.IsNullOrWhiteSpace(request.Email)) sinhVien.Email = request.Email;
                if (!string.IsNullOrWhiteSpace(request.SoDienThoai)) sinhVien.SoDienThoai = request.SoDienThoai;
                if (!string.IsNullOrWhiteSpace(request.HoTen)) sinhVien.HoTen = request.HoTen;
                if (request.GioiTinhEnum is not null) sinhVien.GioiTinh = request.GioiTinhEnum;
                if (request.NgaySinh is not null) sinhVien.NgaySinh = request.NgaySinh;
                sinhVien.NgayNhapHoc = request.NgayNhapHoc;
                sinhVien.MSSV = request.MSSV;
                sinhVien.LopHocId = request.LopHocId;
                sinhVien.CCCD = request.CCCD;
                sinhVien.DiaChi = request.DiaChi;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật sinh viên thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }
}