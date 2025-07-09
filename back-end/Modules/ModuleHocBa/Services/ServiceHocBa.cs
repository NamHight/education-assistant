using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.HocBaExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleHocBa.DTOs.Param;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleHocBa.Services;

public class ServiceHocBa : IServiceHocBa
{
    private readonly IDiemSoHelper _diemSoHelper;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceHocBa(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper,
        IDiemSoHelper diemSoHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _diemSoHelper = diemSoHelper;
    }

    public async Task<ResponseHocBaDto> CreateAsync(RequestAddHocbaDto request)
    {
        try
        {
            var newHocBa = _mapper.Map<HocBa>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.HocBa.CreateAsync(newHocBa);
            });
            _loggerService.LogInfo("Thêm thông tin học bạ thành công.");
            var hocBaDto = _mapper.Map<ResponseHocBaDto>(newHocBa);
            return hocBaDto;
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
            if (id == Guid.Empty) throw new HocBaBadRequestException($"Khoa với {id} không được bỏ trống!");
            var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
            if (hocBa is null) throw new HocBaNotFoundException(id);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.HocBa.DeleteHocBa(hocBa);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa học bạ thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task DeleteListHocBaAsync(RequestDeleteHocBaDto request)
    {
        if (request is null) throw new HocBaBadRequestException("Danh sách id học bạ không được để trống!.");
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkDeleteEntityAsync<HocBa>(request.Ids!);
        });
        _loggerService.LogInfo("Xóa điểm học bạ hàng loại thành công thành công.");
    }

    public async Task<(IEnumerable<ResponseHocBaDto> data, PageInfo page)> GetAllHocBaAsync(ParamHocBaDto paramHocBaDto)
    {
        var hocBas = await _repositoryMaster.HocBa.GetAllHocBaAsync(paramHocBaDto.page,
            paramHocBaDto.limit,
            paramHocBaDto.search,
            paramHocBaDto.sortBy,
            paramHocBaDto.sortByOrder,
            paramHocBaDto.lopHocPhanId,
            paramHocBaDto.sinhVienId);
        var hocBaDtos = _mapper.Map<IEnumerable<ResponseHocBaDto>>(hocBas);
        return (data: hocBaDtos, page: hocBas!.PageInfo);
    }

    public async Task<ResponseHocBaSummaryDto> GetAllHocBaBySinhVienAsync(ParamHocBaBySinhVienDto param)
    {
        var sinhVien = await _repositoryMaster.SinhVien.GetSinhVienByMssvAsync(param.mssv, false);
        if (sinhVien is null)
        {
            return new ResponseHocBaSummaryDto
            {
                ListHocBa = Enumerable.Empty<ResponseHocBaDto>(),
                GPA = null
            };
        }
        var hocBas = await _repositoryMaster.HocBa.GetAllHocBaBySinhVienAsync(param.search, param.sortBy, param.sortByOrder, sinhVien.Id);
        var GPA = await _repositoryMaster.HocBa.TinhGPAAsync(sinhVien.Id);
        var hocBaDtos = _mapper.Map<IEnumerable<ResponseHocBaDto>>(hocBas);
        return new ResponseHocBaSummaryDto
        {
            ListHocBa = hocBaDtos,
            GPA = GPA
        };
    }

    public async Task<ResponseHocBaDto> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null) throw new HocBaNotFoundException(id);
        var hocBaDto = _mapper.Map<ResponseHocBaDto>(hocBa);
        return hocBaDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateHocbaDto request)
    {
        try
        {
            if (id != request.Id)
                throw new HocBaBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
            var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, true);
            if (hocBa is null) throw new HocBaNotFoundException(id);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                hocBa.DiemTongKet = request.DiemTongKet;
                hocBa.KetQua = request.DiemTongKet >= 5 ? (int)KetQuaHocBaEnum.DAT : (int)KetQuaHocBaEnum.KHONG_DAT;
                hocBa.SinhVienId = request.SinhVienId;
                hocBa.LopHocPhanId = request.LopHocPhanId;
                hocBa.ChiTietChuongTrinhDaoTaoId = request.ChiTietChuongTrinhDaoTaoId;
                hocBa.UpdatedAt = DateTime.Now;
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật học bạ thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task UpdateListHocBaAsync(RequestListUpdateHocbaDto request)
    {
        if (request.ListDiemSo == null)
            throw new ChiTietLopHocPhanBadRequestException("Danh sách điểm số không được bỏ trống!.");
        var sinhVienIds = request.ListDiemSo.Select(d => d.SinhVienId!.Value).ToList();
        var allSvCtdt = await _repositoryMaster.sinhVienChuongTrinhDao
            .GetSinhVienChuongTrinhDaoTaoByIdsAsync(sinhVienIds);
        // var svCtdtDict = allSvCtdt
        //     .GroupBy(s => s.SinhVienId!.Value)s
        //     .ToDictionary(g => g.Key, g => g.ToList());
        var allChuongTrinhIds = allSvCtdt
            .Select(s => s.ChuongTrinhDaoTaoId!.Value)
            .Distinct()
            .ToList();
        var ctctdt = await _repositoryMaster.ChiTietChuongTrinhDaoTao
            .GetCtctdtByIdsCtctdtAndMonHocAsync(allChuongTrinhIds, request.MonHocId);
        var exsitingHocBas =
            await _repositoryMaster.HocBa.GetAllHocBaByKeysAsync(sinhVienIds, ctctdt!.Id);
        var hocBaDict =
            exsitingHocBas.ToDictionary(e => (e.SinhVienId, e.ChiTietChuongTrinhDaoTaoId), e => e);
        var updateHocBas = new List<HocBa>();
        foreach (var diemSo in request.ListDiemSo)
        {
            var diemTongKetLopHocPhan = _diemSoHelper.ComparePoint(diemSo.DiemTongKet1, diemSo.DiemTongKet2);
            var key = (diemSo.SinhVienId, ctctdt.Id);
            if (!hocBaDict.TryGetValue(key, out var exsitingHocBa))
            {
                _loggerService.LogInfo($"Bỏ qua bảng ghi cho sinh viên id: {diemSo.SinhVienId}");
                continue;
            }

            var diemSoTong = _diemSoHelper.ComparePoint(diemTongKetLopHocPhan, exsitingHocBa.DiemTongKet!.Value);
            var hocBa = new HocBa
            {
                Id = exsitingHocBa.Id,
                DiemTongKet = diemSoTong,
                MoTa = exsitingHocBa.MoTa,
                KetQua = diemSoTong >= 5 ? (int)KetQuaHocBaEnum.DAT : (int)KetQuaHocBaEnum.KHONG_DAT,
                SinhVienId = diemSo.SinhVienId,
                ChiTietChuongTrinhDaoTaoId = ctctdt.Id,
                CreatedAt = exsitingHocBa.CreatedAt,
                UpdatedAt = DateTime.Now
            };
            if (exsitingHocBa.KetQua == (int)KetQuaHocBaEnum.KHONG_DAT && diemSoTong >= 5)
                hocBa.LopHocPhanId = request.LopHocPhanId;
            updateHocBas.Add(hocBa);
        }

        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync(updateHocBas);
        });
        var updateHocBaSinhVienIds = updateHocBas
            .Where(hb => hb.SinhVienId.HasValue)
            .Select(hb => hb.SinhVienId!.Value)
            .Distinct()
            .ToList();
        var getALlSinhVien = await _repositoryMaster.SinhVien.GetAllSinhVienByIds(updateHocBaSinhVienIds, true);
        var gpaCalculations = getALlSinhVien.Select(async sinhVien => new
        {
            SinhVien = sinhVien,
            GPA = await _repositoryMaster.HocBa.TinhGPAAsync(sinhVien.Id)
        });
        var results = await Task.WhenAll(gpaCalculations);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            foreach (var result in results)
                if (result.GPA.HasValue)
                {
                    var gpa = result.GPA.Value;
                    var sinhVien = result.SinhVien;
                    if (gpa >= 9)
                        sinhVien!.TinhTrangHocTap = (int)TinhTrangHocTapSinhVienEnum.XUAT_SAC;
                    else if (gpa >= 8)
                        sinhVien!.TinhTrangHocTap = (int)TinhTrangHocTapSinhVienEnum.GIOI;
                    else if (gpa >= 7)
                        sinhVien!.TinhTrangHocTap = (int)TinhTrangHocTapSinhVienEnum.KHA;
                    else if (gpa >= 5)
                        sinhVien!.TinhTrangHocTap = (int)TinhTrangHocTapSinhVienEnum.TRUNG_BINH;
                    else if (gpa < 5)
                        sinhVien!.TinhTrangHocTap = (int)TinhTrangHocTapSinhVienEnum.YEU;
                }
        });

        try
        {
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.ChiTietLopHocPhan.UpdateNgayNopDiemChiTietLopHocPhanByLopHocPhanIdAsync(
                    request.LopHocPhanId);
            });
        }
        catch (Exception ex)
        {
            throw new Exception($"Lỗi hệ thống khi cập nhất ngày nộp điểm chi tiết lớp học phần : {ex.Message}");
        }
    }

    // public async Task UpdateListHocBaAsync(List<RequestUpdateHocbaDto> listRequest)
    // {
    //     var hocBaIds = listRequest.Select(e => e.Id).ToList();

    //     var exsitingHocBas = await _repositoryMaster.HocBa.GetAllHocBaByIdAsync(hocBaIds);

    //     var hocBaDict = exsitingHocBas.ToDictionary(e => e.Id);

    //     var updateHocBas = new List<HocBa>();

    //     foreach (var request in listRequest)
    //     {
    //         if (!hocBaDict.TryGetValue(request.Id, out var hocBa)) continue;
    //         var hocBaUpdate = _mapper.Map<HocBa>(request);

    //         hocBaUpdate.LanHoc = hocBaUpdate.LanHoc + 1;

    //         var diemso = _diemSoHelper.ComparePoint(request.DiemTongKetLopHocPhan, hocBaUpdate.DiemTongKet);

    //         hocBaUpdate.DiemTongKet = diemso;
    //         hocBaUpdate.KetQuaHocBaEnum = diemso >= 5 ? KetQuaHocBaEnum.DAT : KetQuaHocBaEnum.KHONG_DAT;
    //         hocBaUpdate.UpdatedAt = DateTime.Now;

    //         updateHocBas.Add(hocBaUpdate);
    //     }
    //     await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
    //     {
    //         await _repositoryMaster.BulkUpdateEntityAsync<HocBa>(updateHocBas);
    //     });
    //     _loggerService.LogInfo("Cập nhật danh sách học bạ thành công.");
    // }
}