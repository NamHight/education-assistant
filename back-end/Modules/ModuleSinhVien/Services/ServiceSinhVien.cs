using AutoMapper;
using ClosedXML.Excel;
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

    public async Task<byte[]> ExportFileExcelAsync(Guid lopId)
    {
        if (lopId == Guid.Empty)
        {
            throw new LopHocBadRequestException($"Id lớp học không được bỏ trống.");
        }
        var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(lopId, false);
        if (lopHoc is null)
        {
            throw new LopHocNotFoundException(lopId);
        }
        var sinhVienList = await _repositoryMaster.SinhVien.GetAllSinhVienExportFileAsync(lopId);
        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("DanhSachSinhVien");

            worksheet.Cell(1, 1).Value = "STT";
            worksheet.Cell(1, 2).Value = "MSSV";
            worksheet.Cell(1, 3).Value = "CCCD";
            worksheet.Cell(1, 4).Value = "Họ và Tên";
            worksheet.Cell(1, 5).Value = "Email";
            worksheet.Cell(1, 6).Value = "Số Điện Thoại";
            worksheet.Cell(1, 7).Value = "Ngày Sinh";
            worksheet.Cell(1, 8).Value = "Giới Tính";
            worksheet.Cell(1, 9).Value = "Địa Chỉ";
            worksheet.Cell(1, 10).Value = "Ngày Nhập Học";
            worksheet.Cell(1, 11).Value = "Ngày Tốt Nghiệp";
            worksheet.Cell(1, 12).Value = "Tên Lớp";

            var headerRange = worksheet.Range("A1:L1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

            for (int i = 0; i < sinhVienList.Count; i++)
            {
                var item = sinhVienList[i];
                worksheet.Cell(i + 2, 1).Value = i + 1;
                worksheet.Cell(i + 2, 2).Value = "`" + item.MSSV;
                worksheet.Cell(i + 2, 3).Value = "`" + item.CCCD;
                worksheet.Cell(i + 2, 4).Value = item.HoTen;
                worksheet.Cell(i + 2, 5).Value = item.Email;
                worksheet.Cell(i + 2, 6).Value = "`" + item.SoDienThoai;
                worksheet.Cell(i + 2, 7).Value = (item.NgaySinh.HasValue && item.NgaySinh.Value != DateTime.MinValue)
                                                                    ? item.NgaySinh.Value.ToString("dd/MM/yyyy")
                                                                    : "";
                worksheet.Cell(i + 2, 8).Value = item.GioiTinh;
                worksheet.Cell(i + 2, 9).Value = item.DiaChi;
                worksheet.Cell(i + 2, 10).Value = (item.NgayNhapHoc.HasValue && item.NgayNhapHoc.Value != DateTime.MinValue)
                                                                    ? item.NgayNhapHoc.Value.ToString("dd/MM/yyyy")
                                                                    : "";
                worksheet.Cell(i + 2, 11).Value = (item.NgayTotNghiep.HasValue && item.NgayTotNghiep.Value != DateTime.MinValue)
                                                                    ? item.NgayTotNghiep.Value.ToString("dd/MM/yyyy")
                                                                    : "";
                worksheet.Cell(i + 2, 12).Value = item.TenLop;
            }
            // Format ngày/tháng
            worksheet.Column(7).Style.DateFormat.Format = "dd/MM/yyyy";
            worksheet.Column(10).Style.DateFormat.Format = "dd/MM/yyyy";
            worksheet.Column(11).Style.DateFormat.Format = "dd/MM/yyyy";

            worksheet.Columns().AdjustToContents();

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }

    }

    public async Task<(IEnumerable<ResponseSinhVienTinhTrangHocTapDto> data, PageInfo page)> GetAllSinhVienAsync(
        ParamSinhVienDto paramSinhVienDto)
    {
        var sinhViens = await _repositoryMaster.SinhVien.GetAllSinhVienAsync(paramSinhVienDto.page,
            paramSinhVienDto.limit, paramSinhVienDto.search, paramSinhVienDto.sortBy, paramSinhVienDto.sortByOrder,
            paramSinhVienDto.lopId, paramSinhVienDto.tinhTrangHocTap);
        
        var sinhVienDtos = _mapper.Map<IEnumerable<ResponseSinhVienTinhTrangHocTapDto>>(sinhViens);
        foreach (var svDto in sinhVienDtos)
        {
            var gpa = await _repositoryMaster.HocBa.TinhGPAAsync(svDto.Id);
            var diemDanh = await _repositoryMaster.ChiTietLopHocPhan.TinhPhanTramChuyenCanAsync(svDto.Id);

            svDto.GPA = gpa ?? 0;
            svDto.DiemDanh = diemDanh;
        }

        return (data: sinhVienDtos, page: sinhViens!.PageInfo);
    }

    public async Task<ResponseSinhVienSummaryDto> GetALlSummaryAsync(Guid lopHocId)
    {
        var tongSo = await _repositoryMaster.SinhVien.GetAllTongSoAsync(lopHocId);
        var soXuatSac = await _repositoryMaster.SinhVien.GetAllSoXuatSacAsync(lopHocId);
        var soKha = await _repositoryMaster.SinhVien.GetAllSoKhaAsync(lopHocId);
        var SoCanCaiThien = await _repositoryMaster.SinhVien.GetAllSoCanCaiThienAsync(lopHocId);

        var soDangHoc = await _repositoryMaster.SinhVien.GetAllSoDangHocAsync(lopHocId);
        var soDaTotNghiep = await _repositoryMaster.SinhVien.GetAllSoDaTotNghiepAsync(lopHocId);
        var SoTamNghi = await _repositoryMaster.SinhVien.GetAllSoTamNghiAsync(lopHocId);
        var dataSinhVien = new ResponseSinhVienSummaryDto
        {
            TongSoSinhVien = tongSo,
            SoXuatSac = soXuatSac,
            SoKha = soKha,
            SoCanCaiThien = SoCanCaiThien,

            SoDangHoc = soDangHoc,
            SoDaTotNghiep = soDaTotNghiep,
            SoTamNghi = SoTamNghi,
        };

        return dataSinhVien;
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

            var importData = new List<ImportFileSinhVienDto>();
        try
        {
            using (var stream = request.File!.OpenReadStream())
            using (var workbook = new XLWorkbook(stream))
            {
                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RowsUsed().Skip(1);

                foreach (var row in rows)
                {
                    var dto = new ImportFileSinhVienDto
                    {
                        STT = row.Cell(1).GetValue<int>(),
                        MSSV = row.Cell(2).GetString().Trim().Replace("`", ""),
                        CCCD = row.Cell(3).GetString().Trim().Replace("`", ""),
                        HoTen = row.Cell(4).GetString().Trim(),
                        Email = row.Cell(5).GetString().Trim(),
                        SoDienThoai = row.Cell(6).GetString().Trim().Replace("`", ""),
                        NgaySinh = TryParseDateCell(row.Cell(7)),
                        GioiTinh = row.Cell(8).IsEmpty() ? null : row.Cell(8).GetString().Trim(),
                        DiaChi = row.Cell(9).IsEmpty() ? null : row.Cell(9).GetString().Trim(),
                        NgayNhapHoc = TryParseDateCell(row.Cell(10)) ?? DateTime.MinValue,
                        NgayTotNghiep = TryParseDateCell(row.Cell(11)) ?? DateTime.MinValue,
                    };
                    importData.Add(dto); 
                }
            }
        }catch (Exception ex) {
            throw new Exception($"Lỗi không xác định khi import file: {ex.Message}");
        }
            var newSinhViens = new List<SinhVien>();
            foreach (var item in importData)
            {
                var exsitingSinhVien = await _repositoryMaster.SinhVien.GetSinhVienByMssvOrCccdAsync(item.MSSV, item.CCCD);
                if (exsitingSinhVien is not null)
                {
                    throw new SinhVienBadRequestException($"Sinh viên có mssv: {item.MSSV} hoặc cccd: {item.CCCD} đã trùng trong dữ liệu");
                }
                var sv = new SinhVien
                {
                    MSSV = item.MSSV,
                    CCCD = item.CCCD,
                    HoTen = item.HoTen,
                    Email = item.Email,
                    SoDienThoai = item.SoDienThoai,
                    NgaySinh = (item.NgaySinh.HasValue && item.NgaySinh.Value > new DateTime(1900, 1, 1))
                                        ? item.NgaySinh.Value
                                        : DateTime.MinValue,
                    DiaChi = item.DiaChi,
                    GioiTinh = item.GioiTinh.ToLower() == "nam" ? (int)GioiTinhEnum.NAM : item.GioiTinh.ToLower() == "nữ" ? (int)GioiTinhEnum.NU : null,
                    NgayNhapHoc = (item.NgayNhapHoc.HasValue && item.NgayNhapHoc.Value > new DateTime(1900, 1, 1))
                                        ? item.NgayNhapHoc.Value
                                        : DateTime.MinValue,
                    NgayTotNghiep = (item.NgayTotNghiep.HasValue && item.NgayTotNghiep.Value > new DateTime(1900, 1, 1))
                                        ? item.NgayTotNghiep.Value
                                        : DateTime.MinValue,
                    TrangThaiSinhVien = (int)TrangThaiSinhVienEnum.DANG_HOC,
                    CreatedAt = DateTime.Now,
                    LopHocId = request.lopHocId
                };
                newSinhViens.Add(sv);
            }
        try{
            if (newSinhViens.Any())
            {
                await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
                {
                    await _repositoryMaster.BulkAddEntityAsync<SinhVien>(newSinhViens);
                });
            }
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi khi thêm danh sách sinh viên: {ex.Message}");
        }
    }
    private DateTime? TryParseDateCell(IXLCell cell)
    {
        try
        {
            if (cell.IsEmpty()) return null;

            var raw = cell.GetString().Trim();
            if (string.IsNullOrWhiteSpace(raw)) return null;

            if (DateTime.TryParse(raw, out var result) && result > new DateTime(1900, 1, 1))
                return result;
        }
        catch
        {
            
        }
        return null;
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