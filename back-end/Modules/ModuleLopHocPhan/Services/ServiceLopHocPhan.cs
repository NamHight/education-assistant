using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.MonHocExceptions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLopHocPhan.Services;

public class ServiceLopHocPhan : IServiceLopHocPhan
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceLopHocPhan(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }

    public async Task<ResponseLopHocPhanDto> CreateAsync(RequestAddLopHocPhanDto request)
    {
        try
        {
            var monHoc = await _repositoryMaster.MonHoc.GetMonHocByIdAsync(request.MonHocId, false);
            if (monHoc is null) throw new MonHocNotFoundException(request.MonHocId);
            var newLopHocPhan = _mapper.Map<LopHocPhan>(request);
            newLopHocPhan.MaHocPhan = $"LopHKP_{monHoc.TenMonHoc}_{DateTime.Now:dd_MM_yy}";
            newLopHocPhan.Loai = (int)LoaiLopHocEnum.LOP_HOC_KY_PHU;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.LopHocPhan.CreateAsync(newLopHocPhan);
            });
            _loggerService.LogInfo("Thêm thông tin lớp học phần học kỳ phụ thành công.");
            var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(newLopHocPhan);
            return lopHocPhanDto;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task CreateAutoLopHocPhanAsync(RequestGenerateLopHocPhanDto request)
    {
        var ChuongTrinhDaoTao =
            await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(request.Khoa,
                request.NganhId);
        if (ChuongTrinhDaoTao is null)
            throw new ChuongTrinhDaoTaoBadRequestException("Không tìm thấy chương trình đào tạo dựa theo id ngành.");
        var ctctdts =
            await _repositoryMaster.ChiTietChuongTrinhDaoTao.GetChiTietChuongTrinhDaoTaoByHocKyAndChuongTrinhId(
                request.HocKy, ChuongTrinhDaoTao.Id);
        if (ctctdts is null)
            throw new ChiTietChuongTrinhDaoTaoBadRequestException("Môn học chưa được thêm chương trình đào tạo");
        var lopHocs = await _repositoryMaster.LopHoc.GetLopHocByKhoaAndNganhIdAsync(request.Khoa, request.NganhId);
        if (lopHocs is null) throw new LopHocBadRequestException("Không tìm thấy lớp học trong ngành id");
        var newLopHocPhans = new List<(LopHocPhan LopHocPhan, Guid LopHocId)>();
        foreach (var ctctdt in ctctdts)
        foreach (var lopHoc in lopHocs)
        {
            var lopHocPhanExsiting = await _repositoryMaster.LopHocPhan.KiemTraLopHocPhanDaTonTaiAsync(request.NganhId,
                request.HocKy, request.Khoa, ctctdt.MonHocId!.Value);
            if (lopHocPhanExsiting) throw new LopHocPhanExistdException("Lớp học phần đã được tạo rồi");
            var lopHocPhan = new LopHocPhan
            {
                Id = Guid.NewGuid(),
                MaHocPhan = $"{lopHoc.MaLopHoc}_{ctctdt.MonHoc!.TenMonHoc}",
                MonHocId = ctctdt.MonHocId!.Value,
                SiSo = lopHoc.SiSo,
                TrangThai = 1,
                Loai = (int)LoaiLopHocEnum.LOP_HOC_PHAN,
                CreatedAt = DateTime.Now
            };
            newLopHocPhans.Add((lopHocPhan, lopHoc.Id));
        }

        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            var lopHocPhanEntities = newLopHocPhans.Select(item => item.LopHocPhan).ToList();
            await _repositoryMaster.BulkAddEntityAsync(lopHocPhanEntities);
        });
        try
        {
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                foreach (var (lopHocPhan, lopHocId) in newLopHocPhans)
                {
                    var ctctdt = ctctdts.FirstOrDefault(ct =>
                        ct.MonHocId == lopHocPhan.MonHocId && ct.HocKy == request.HocKy);
                    await _repositoryMaster.LopHocPhan.CreateSinhVienLopHocPhanHocBa(lopHocId, lopHocPhan.Id,
                        lopHocPhan.GiangVienId, lopHocPhan.MonHocId, ctctdt!.Id, request.HocKy);
                }
            });
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
            if (id == Guid.Empty)
                throw new LopHocPhanBadRequestException($"Lớp học phần với id: {id} không được bỏ trống!");
            var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.LopHocPhan.DeleteLopHocPhan(lopHocPhan);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Xóa lớp học phần thành công.");
        }
        catch (DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message?.ToLower();
            if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                                              inner.Contains("reference constraint") ||
                                              inner.Contains("violates foreign key constraint") ||
                                              inner.Contains("cannot delete or update a parent row")))
                throw new LopHocPhanBadRequestException("Không thể xóa lớp học phần vì có ràng buộc khóa ngoại!.");
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }


    public async Task<(IEnumerable<ResponseLopHocPhanDto> data, PageInfo page)> GetAllLopHocPhanAsync(
        ParamLopHocPhanDto paramLopHocPhanDto)
    {
        var lopHocPhans = await _repositoryMaster.LopHocPhan.GetAllLopHocPhanAsync(paramLopHocPhanDto.page,
            paramLopHocPhanDto.limit,
            paramLopHocPhanDto.search,
            paramLopHocPhanDto.sortBy,
            paramLopHocPhanDto.sortByOrder,
            paramLopHocPhanDto.khoa,
            paramLopHocPhanDto.loaiChuongTrinhDaoTao,
            paramLopHocPhanDto.chuongTrinhDaoTaoId,
            paramLopHocPhanDto.hocKy,
            paramLopHocPhanDto.trangThai,
            paramLopHocPhanDto.loaiLopHoc);
        var lopHocPhanDtos = _mapper.Map<IEnumerable<ResponseLopHocPhanDto>>(lopHocPhans);
        return (data: lopHocPhanDtos, page: lopHocPhans!.PageInfo);
    }

    public async Task<ResponseLopHocPhanDto> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
        if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
        var lopHocPhanDto = _mapper.Map<ResponseLopHocPhanDto>(lopHocPhan);
        return lopHocPhanDto;
    }

    public async Task UpdateAsync(Guid id, RequestUpdateSimpleLopHocPhanDto request)
    {
        try
        {
            if (id != request.Id)
                throw new LopHocPhanBadRequestException($"Id: {id} và Lớp học phần id: {request.Id} không giống nhau!");
            var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, false);
            if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);

            lopHocPhan.SiSo = request.SiSo;
            lopHocPhan.TrangThai = request.TrangThai;
            lopHocPhan.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.LopHocPhan.UpdateLopHocPhan(lopHocPhan);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo("Cập nhật lớp học phần thành công.");
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }

    public async Task UpdateListLophocPhanAsync(List<RequestUpdateLopHocPhanDto> listRequest)
    {
        var lopHocPhans = _mapper.Map<List<LopHocPhan>>(listRequest);
        await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
        {
            await _repositoryMaster.BulkUpdateEntityAsync(lopHocPhans);
            foreach (var request in listRequest)
                await _repositoryMaster.ChiTietLopHocPhan.UpdateCtlhpWithPhanCongAsync(request.Id, request.GiangVienId,
                    request.MonHocId);
        });
        _loggerService.LogInfo("Cập nhật list phân công giảng viên thành công.");
    }

    public async Task UpdateTrangThaiAsync(Guid id, int trangThai)
    {
        try
        {
            if (trangThai <= 0 && trangThai >= 3) throw new LopHocBadRequestException("Trạng thái không đúng");
            var lopHocPhan = await _repositoryMaster.LopHocPhan.GetLopHocPhanByIdAsync(id, true);
            
            if (lopHocPhan is null) throw new LopHocPhanNotFoundException(id);
            Console.WriteLine($"asdsadasdasdasasd 9999999 {trangThai}");
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                lopHocPhan.TrangThai = trangThai;
                await Task.CompletedTask;
            });
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Lỗi hệ thống!: {ex.Message}");
        }
    }
}