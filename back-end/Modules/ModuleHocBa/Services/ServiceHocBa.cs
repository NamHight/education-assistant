using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.HocBaExceptions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleHocBa.Services;

public class ServiceHocBa : IServiceHocBa
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IMapper _mapper;
    private readonly IDiemSoHelper _diemSoHelper;

    public ServiceHocBa(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IDiemSoHelper diemSoHelper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _diemSoHelper = diemSoHelper;
    }
    public async Task<ResponseHocBaDto> CreateAsync(RequestAddHocbaDto request)
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

    public async Task DeleteAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new HocBaBadRequestException($"Khoa với {id} không được bỏ trống!");
        }
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.HocBa.DeleteHocBa(hocBa);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Xóa học bạ thành công.");
    }

    public async Task DeleteListHocBaAsync(RequestDeleteHocBaDto request)
    {
        if (request is null)
        {
            throw new HocBaBadRequestException("Danh sách id học bạ không được để trống!.");
        }
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkDeleteEntityAsync<HocBa>(request.Ids!);
        });
        _loggerService.LogInfo("Xóa điểm học bạ hàng loại thành công thành công.");
    }

    public async Task<(IEnumerable<ResponseHocBaDto> data, PageInfo page)> GetAllHocBaAsync(ParamBaseDto paramBaseDto)
    {
        var hocBas = await _repositoryMaster.HocBa.GetAllHocBaAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search, paramBaseDto.sortBy, paramBaseDto.sortByOrder);
        var hocBaDtos = _mapper.Map<IEnumerable<ResponseHocBaDto>>(hocBas);
        return (data: hocBaDtos, page: hocBas!.PageInfo);
    }

    public async Task<ResponseHocBaDto> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        var hocBaDto = _mapper.Map<ResponseHocBaDto>(hocBa);
        return hocBaDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateHocbaDto request)
    {
        if (id != request.Id)
        {
            throw new HocBaBadRequestException($"Id: {id} và Id: {request.Id} của khoa không giống nhau!");
        }
        var hocBa = await _repositoryMaster.HocBa.GetHocBaByIdAsync(id, false);
        if (hocBa is null)
        {
            throw new HocBaNotFoundException(id);
        }
        var hocBaUpdate = _mapper.Map<HocBa>(request);
        hocBaUpdate.LanHoc = hocBaUpdate.LanHoc + 1;
        var diemso = _diemSoHelper.ComparePoint(request.DiemTongKetLopHocPhan, hocBaUpdate.DiemTongKet);
        hocBaUpdate.DiemTongKet = diemso;
        hocBaUpdate.KetQuaHocBaEnum = diemso >= 5 ? KetQuaHocBaEnum.DAT : KetQuaHocBaEnum.KHONG_DAT;
        hocBaUpdate.UpdatedAt = DateTime.Now;
        
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.HocBa.UpdateHocBa(hocBaUpdate);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật học bạ thành công.");
    }

    public async Task UpdateListHocBaAsync(RequestListUpdateHocbaDto request)
    {
        if (request.listDiemSo == null)
        {
            throw new ChiTietLopHocPhanBadRequestException("Danh sách điểm số không được bỏ trống!.");
        }
        var ctctdt = await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetCtctdtByCtctAndMonHocAsync(request.ChuongTrinhDaoTaoId, request.MonHocId);
        if (ctctdt is null)
        {
            throw new ChiTietChuongTrinhDaoTaoBadRequestException("Môn học chưa được thêm chương trình đào tạo");
        }
        var hocBaKeys = request.listDiemSo
            .Where(d => d.SinhVienId.HasValue)
            .Select(d => new { SinhVienId = d.SinhVienId!.Value })
            .ToList();
        var exsitingHocBas = await _repositoryMaster.HocBa.GetAllHocBaByKeysAsync(hocBaKeys.Select(item => item.SinhVienId).ToList(), request.LopHocPhanId, ctctdt.Id);
        var hocBaDict = exsitingHocBas.ToDictionary(e => (e.SinhVienId, e.LopHocPhanId, e.ChiTietChuongTrinhDaoTaoId), e => e);
        var updateHocBas = new List<HocBa>();

        foreach (var diemSo in request.listDiemSo)
        {
            var diemTongKetLopHocPhan = _diemSoHelper.ComparePoint(diemSo.DiemTongKet1, diemSo.DiemTongKet2);
            var key = (diemSo.SinhVienId, request.LopHocPhanId, ctctdt.Id);
            if (!hocBaDict.TryGetValue(key, out var exsitingHocBa))
            {
                _loggerService.LogInfo($"Bỏ qua bảng ghi cho sinh viên id: {diemSo.SinhVienId}");
                continue;
            }
            var diemSoTong = _diemSoHelper.ComparePoint(diemTongKetLopHocPhan, exsitingHocBa.DiemTongKet);
            var hocBa = new HocBa
            {
                Id = exsitingHocBa.Id,
                DiemTongKet = diemSoTong,
                MoTa = exsitingHocBa.MoTa,
                LanHoc = exsitingHocBa.LanHoc + 1,
                KetQua = diemSoTong >= 5 ? (int)KetQuaHocBaEnum.DAT : (int)KetQuaHocBaEnum.KHONG_DAT,
                SinhVienId = diemSo.SinhVienId,
                LopHocPhanId = request.LopHocPhanId,
                ChiTietChuongTrinhDaoTaoId = ctctdt.Id,
                UpdatedAt = DateTime.Now,
            };
            updateHocBas.Add(hocBa);
        }
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync<HocBa>(updateHocBas);
        });
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
