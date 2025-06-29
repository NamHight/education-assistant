using System;
using AutoMapper;
using ClosedXML.Excel;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;

public class ServiceChiTietLopHocPhan : IServiceChiTietLopHocPhan
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    public ServiceChiTietLopHocPhan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseChiTietLopHocPhanDto> CreateAsync(RequestAddChiTietLopHocPhanDto request)
    {

        try
        {
            var newDiemSo = _mapper.Map<ChiTietLopHocPhan>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.ChiTietLopHocPhan.CreateAsync(newDiemSo);
            });
            _loggerService.LogInfo("Thêm thông tin chi tiết lớp học phần thành công.");
            var diemSoDto = _mapper.Map<ResponseChiTietLopHocPhanDto>(newDiemSo);
            return diemSoDto;      
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteAsync(Guid id)
    {

        try
        {
            var diemSo = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
            if (diemSo is null)
            {
                throw new ChiTietLopHocPhanNotFoundException(id);
            }
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.ChiTietLopHocPhan.DeleteChiTietLopHocPhan(diemSo);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa chi tiết lớp học phần thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteListChiTietLopHocPhanAsync(RequestDeleteChiTietLopHocPhanDto request)
    {
        if (request is null)
        {
            throw new ChiTietLopHocPhanBadRequestException("Danh sách id không được bỏ trống.");
        }
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkDeleteEntityAsync<ChiTietLopHocPhan>(request.Ids!);
        });
        _loggerService.LogInfo("Xóa điểm hàng loại thành công thành công.");
    }

    public async Task<byte[]> ExportFileExcelAsync(Guid lopHocPhanId)
    {
        if (lopHocPhanId == Guid.Empty)
        {
            throw new ChiTietLopHocPhanBadRequestException("Id lớp học phần không được bỏ trống");
        }
        var diemSoList = await _repositoryMaster.ChiTietLopHocPhan.GetAllDiemSoExportFileAsync(lopHocPhanId);
        using (var workbook = new XLWorkbook()) {
            var worksheet = workbook.Worksheets.Add("DanhSachDiemSo");

            worksheet.Cell(1, 1).Value = "STT";
            worksheet.Cell(1, 2).Value = "Mã SV";
            worksheet.Cell(1, 3).Value = "Họ Tên";
            worksheet.Cell(1, 4).Value = "Môn Học";
            worksheet.Cell(1, 5).Value = "Giảng Viên";
            worksheet.Cell(1, 6).Value = "Điểm Chuyên Cần";
            worksheet.Cell(1, 7).Value = "Điểm Trung Bình";
            worksheet.Cell(1, 8).Value = "Điểm Thi 1";
            worksheet.Cell(1, 9).Value = "Điểm Thi 2";
            worksheet.Cell(1, 10).Value = "Điểm Tổng Kết 1";
            worksheet.Cell(1, 11).Value = "Điểm Tổng Kết 2";
            worksheet.Cell(1, 12).Value = "Học Kỳ";
            worksheet.Cell(1, 13).Value = "Ghi Chú";

            var headerRange = worksheet.Range("A1:M1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

            for (int i = 0; i < diemSoList.Count; i++)
            {
                var item = diemSoList[i];
                worksheet.Cell(i + 2, 1).Value = i + 1;
                worksheet.Cell(i + 2, 2).Value = item.MaSinhVien;
                worksheet.Cell(i + 2, 3).Value = item.HoTenSinhVien;
                worksheet.Cell(i + 2, 4).Value = item.TenMonHoc;
                worksheet.Cell(i + 2, 5).Value = item.HoTenGiangVien;
                worksheet.Cell(i + 2, 6).Value = item.DiemChuyenCan?.ToString("F2");
                worksheet.Cell(i + 2, 7).Value = item.DiemTrungBinh?.ToString("F2");
                worksheet.Cell(i + 2, 8).Value = item.DiemThi1?.ToString("F2");
                worksheet.Cell(i + 2, 9).Value = item.DiemThi2?.ToString("F2");
                worksheet.Cell(i + 2, 10).Value = item.DiemTongKet1?.ToString("F2");
                worksheet.Cell(i + 2, 11).Value = item.DiemTongKet2?.ToString("F2");
                worksheet.Cell(i + 2, 12).Value = item.HocKy;
                worksheet.Cell(i + 2, 13).Value = item.GhiChu;
            }
            worksheet.Column(6).Style.NumberFormat.Format = "0.00";
            worksheet.Column(7).Style.NumberFormat.Format = "0.00";
            worksheet.Column(8).Style.NumberFormat.Format = "0.00";
            worksheet.Column(9).Style.NumberFormat.Format = "0.00";
            worksheet.Column(10).Style.NumberFormat.Format = "0.00";
            worksheet.Column(11).Style.NumberFormat.Format = "0.00";

            worksheet.Columns().AdjustToContents();
            using (var stream = new MemoryStream()) {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }   

    public async Task<(IEnumerable<ResponseChiTietLopHocPhanDto> data, PageInfo page)> GetAllChiTietLopHocPhanAsync(ParamChiTietLopHocPhanDto paramChiTietLopHocPhanDto)
    {
        var diemSos = await _repositoryMaster.ChiTietLopHocPhan.GetAllChiTietLopHocPhanAsync(paramChiTietLopHocPhanDto.page,
                                                                        paramChiTietLopHocPhanDto.limit,
                                                                        paramChiTietLopHocPhanDto.search,
                                                                        paramChiTietLopHocPhanDto.sortBy,
                                                                        paramChiTietLopHocPhanDto.sortByOrder,
                                                                        paramChiTietLopHocPhanDto.lopHocPhanId,
                                                                        paramChiTietLopHocPhanDto.ngayNopDiem);
        var diemSoDto = _mapper.Map<IEnumerable<ResponseChiTietLopHocPhanDto>>(diemSos);
        return (data: diemSoDto, page: diemSos!.PageInfo);
    }

    public async Task<IEnumerable<ResponseChiTietLopHocPhanByLopHocPhanDto>> GetAllChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId, ParamChiTietLopHocPhanSimpleDto ParamChiTietLopHocPhanSimpleDto)
    {
        var diemSos = await _repositoryMaster.ChiTietLopHocPhan.GetAllChiTietLopHocPhanByLopHocPhanIdAsync(lopHocPhanId, ParamChiTietLopHocPhanSimpleDto.search);
        var diemSoDtos = _mapper.Map<IEnumerable<ResponseChiTietLopHocPhanByLopHocPhanDto>>(diemSos)
                .Select((dto, index) =>
                {
                    dto.STT = index + 1;
                    return dto;
                });
        return diemSoDtos;
    }

    public async Task<ResponseChiTietLopHocPhanDto> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        var diemSo = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
        if (diemSo is null)
        {
            throw new ChiTietLopHocPhanNotFoundException(id);
        }
        var diemSoDto = _mapper.Map<ResponseChiTietLopHocPhanDto>(diemSo);
        return diemSoDto;
    }

    public async Task ImportFileExcelAsync(RequestImportFileDiemSoDto request)
    {
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(request.LopHocPhanId, false);
        if (lopHocPhan == null)
        {
            throw new LopHocPhanNotFoundException(request.LopHocPhanId);
        }
        if (request.File == null || request.File.Length == 0)
        {
            throw new ArgumentException("File không được để trống hoặc rỗng.");
        }
        try
        {
            var importData = new List<ImportDiemSoDto>();
            using (var stream = request.File!.OpenReadStream())
            using (var workbook = new XLWorkbook(stream))
            {
                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RowsUsed().Skip(1);

                foreach (var row in rows)
                { 
                    var dto = new ImportDiemSoDto
                    {
                        STT = row.Cell(1).GetValue<int>(),
                        MaSinhVien = row.Cell(2).GetString()?.Trim()!,
                        HoTenSinhVien = row.Cell(3).GetString()?.Trim()!,
                        TenMonHoc = row.Cell(4).GetString()?.Trim()!,
                        HoTenGiangVien = row.Cell(5).GetString()?.Trim()!,
                        DiemChuyenCan = row.Cell(6).IsEmpty() ? null : row.Cell(6).GetValue<decimal>(),
                        DiemTrungBinh = row.Cell(7).IsEmpty() ? null : row.Cell(7).GetValue<decimal>(),
                        DiemThi1 = row.Cell(8).IsEmpty() ? null : row.Cell(8).GetValue<decimal>(),
                        DiemThi2 = row.Cell(9).IsEmpty() ? null : row.Cell(9).GetValue<decimal>(),
                        DiemTongKet1 = row.Cell(10).IsEmpty() ? null : row.Cell(10).GetValue<decimal>(),
                        DiemTongKet2 = row.Cell(11).IsEmpty() ? null : row.Cell(11).GetValue<decimal>(),
                        HocKy = row.Cell(12).IsEmpty() ? null : row.Cell(12).GetValue<int>(),
                        GhiChu = row.Cell(13).GetString()?.Trim()
                    };
                    importData.Add(dto);
                }
            }
            var listChiTiets = new List<ChiTietLopHocPhan>();
            foreach (var item in importData)
            {
                var existingRecord = await _repositoryMaster.ChiTietLopHocPhan.GetByMaSinhVienAndLopHocPhanIdAsync(item.MaSinhVien, request.LopHocPhanId);
                if (existingRecord == null)
                {
                    throw new ChiTietLopHocPhanBadRequestException("Dữ liệu đầu vào file excel không đầy đủ!.");
                }
                existingRecord.DiemChuyenCan = item.DiemChuyenCan;
                existingRecord.DiemTrungBinh = item.DiemTrungBinh;
                existingRecord.DiemThi1 = item.DiemThi1;
                existingRecord.DiemThi2 = item.DiemThi2;
                existingRecord.DiemTongKet1 = item.DiemTongKet1;
                existingRecord.DiemTongKet2 = item.DiemTongKet2;
                existingRecord.HocKy = item.HocKy!.Value;
                existingRecord.GhiChu = item.GhiChu;
                existingRecord.UpdatedAt = DateTime.Now;
                listChiTiets.Add(existingRecord);
            }


            await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
            {
                await _repositoryMaster.BulkUpdateEntityAsync<ChiTietLopHocPhan>(listChiTiets);
            });
        }
        catch (Exception ex)
        {

            throw new Exception($"Lỗi hệ thống import file: {ex.Message}");
        }
    }

    public async Task UpdateAsync(Guid id, RequestUpdateChiTietLopHocPhanDto request)
    {
        try
        {
            if (id != request.Id)
            {
                throw new ChiTietLopHocPhanBadRequestException($"Id: {id} và Id: {request.Id} của bộ môn không giống nhau!");
            }
            var diemSoExstting = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(id, false);
            if (diemSoExstting is null)
            {
                throw new ChiTietLopHocPhanNotFoundException(id);
            }
            diemSoExstting.DiemChuyenCan = request.DiemChuyenCan;
            diemSoExstting.DiemTrungBinh = request.DiemTrungBinh;
            diemSoExstting.DiemThi1 = request.DiemThi1;
            diemSoExstting.DiemThi2 = request.DiemThi2;
            diemSoExstting.DiemTongKet1 = request.DiemTongKet1;
            diemSoExstting.DiemTongKet2 = request.DiemTongKet2;
            diemSoExstting.GhiChu = request.GhiChu;
            diemSoExstting.TrangThai = request.TrangThai;
            diemSoExstting.NgayLuuDiem = DateTime.Now;
            diemSoExstting.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.ChiTietLopHocPhan.UpdateChiTietLopHocPhan(diemSoExstting);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật chi tiết lớp học phần thành công.");
        }catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
        }
    }

    public async Task UpdateListChiTietLopHocPhanAsync(RequestListUpdateDiemSoDto request)
    {
        var diemSos = new List<ChiTietLopHocPhan>();

        foreach (var diemSo in request.ListDiemSo!)
        {
            var existingDiemSo = await _repositoryMaster.ChiTietLopHocPhan.GetChiTietLopHocPhanByIdAsync(diemSo.Id, false);
            if (existingDiemSo is null)
            {
                continue;
            }
            existingDiemSo.DiemChuyenCan = diemSo.DiemChuyenCan;
            existingDiemSo.DiemTrungBinh = diemSo.DiemTrungBinh;
            existingDiemSo.DiemThi1 = diemSo.DiemThi1;
            existingDiemSo.DiemThi2 = diemSo.DiemThi2;
            if (request.LoaiMonHoc == (int)LoaiMonHocEnum.LY_THUYET)
            {
                existingDiemSo.DiemTongKet1 = (diemSo.DiemChuyenCan * 0.1m) + (diemSo.DiemTrungBinh * 0.4m) + (diemSo.DiemThi1 * 0.5m);
                if (diemSo.DiemThi2.HasValue)
                {
                    existingDiemSo.DiemTongKet2 = (diemSo.DiemChuyenCan * 0.1m) + (diemSo.DiemTrungBinh * 0.4m) + (diemSo.DiemThi2 * 0.5m);
                }
            }
            if (request.LoaiMonHoc == (int)LoaiMonHocEnum.MODUN)
            {
                existingDiemSo.DiemTongKet1 = (diemSo.DiemTrungBinh * 0.4m) + (diemSo.DiemThi1 * 0.6m);
            }

            existingDiemSo.GhiChu = diemSo.GhiChu;
            existingDiemSo.NgayLuuDiem = DateTime.Now;
            diemSos.Add(existingDiemSo);
        }
        
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync<ChiTietLopHocPhan>(diemSos);
        });
        _loggerService.LogInfo("Cập nhật điểm hàng loại thành công thành công.");
    }

    public async Task UpdateNopDiemChiTietLopHocPhanAsync(Guid lopHocPhanId)
    {
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(lopHocPhanId, false);
        if (lopHocPhan == null)
        {
            throw new LopHocPhanNotFoundException(lopHocPhanId);
        }
        try
        {
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.ChiTietLopHocPhan.UpdateNgayNopDiemChiTietLopHocPhanByLopHocPhanIdAsync(lopHocPhanId);
            });
        }
        catch (Exception ex)
        {
            throw new Exception($"Lỗi hệ thống : {ex.Message}");
        }
    }
}
