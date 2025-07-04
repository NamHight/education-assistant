using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.LichBieuExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.NganhExceptions;
using Education_assistant.Exceptions.ThrowError.TuanExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Param;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Request;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLichBieu.Services
{
    public class ServiceLichBieu : IServiceLichBieu
    {
        private readonly ILoggerService _loggerService;
        private readonly IRepositoryMaster _repositoryMaster;
        private readonly IMapper _mapper;
        public ServiceLichBieu(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
        {
            _repositoryMaster = repositoryMaster;
            _loggerService = loggerService;
            _mapper = mapper;
        }

        public async Task CopyTuanLichBieuAsync(RequestAddLichBieuListTuanDto request)
        {
            if (request.LichBieus is null || request.LichBieus.Count() == 0)
            {
                throw new LichBieuBadRequestException("Danh sách lịch biểu không bỏ trống!.");
            }
            var lopHocPhanIds = request.LichBieus.Select(x => x.LopHocPhanId).Distinct().ToList();
            
            var tuans = await _repositoryMaster.Tuan.GetTuanCopyByLopHocPhanIdAsync(request.NamHoc, request.VaoTuanId, request.DenTuanId, lopHocPhanIds);
            var listLichBieu = new List<LichBieu>();
            foreach (var tuan in tuans)
            {
                var lichBieuExisting = await _repositoryMaster.LichBieu.GetCheckLichBieuByLopHocPhanIdAsync(tuan.Id, lopHocPhanIds);
                if (lichBieuExisting != null && lichBieuExisting.Any()) 
                {
                    continue;
                }
                foreach (var lichBieuDto in request.LichBieus!)
                {
                    listLichBieu.Add(new LichBieu
                    {
                        TietBatDau = lichBieuDto.TietBatDau,
                        TietKetThuc = lichBieuDto.TietKetThuc,
                        Thu = lichBieuDto.Thu,
                        TuanId = tuan.Id,
                        LopHocPhanId = lichBieuDto.LopHocPhanId,
                        PhongHocId = lichBieuDto.PhongHocId,
                    });
                }
            }
            await _repositoryMaster.ExecuteInTransactionBulkEntityAsync(async () =>
            {
                await _repositoryMaster.BulkAddEntityAsync<LichBieu>(listLichBieu);
            });
            _loggerService.LogInfo("Copy tuần lịch biểu thành công.");
        }

        public async Task<ResponseLichBieuDto> CreateAsync(RequestAddLichBieuDto request)
        {
            try
            {
                var newLichBieu = _mapper.Map<LichBieu>(request);
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    await _repositoryMaster.LichBieu.CreateAsync(newLichBieu);
                });
                _loggerService.LogInfo("Thêm thông tin lịch biểu thành công");
                var lichBieu = _mapper.Map<ResponseLichBieuDto>(newLichBieu);
                return lichBieu;
            }catch (DbUpdateException ex)
            {
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new LichBieuBadRequestException($"Lịch biểu với {id} không được bỏ trống!");
                }
                var lichBieu = await _repositoryMaster.LichBieu.GetLichBieuByIdAsync(id, false);
                if (lichBieu is null)
                {
                    throw new LichBieuNotFoundException(id);
                }
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    _repositoryMaster.LichBieu.DeleteLichBieu(lichBieu);
                    await Task.CompletedTask;
                });
                _loggerService.LogInfo($"Xóa lịch biểu có id = {id} thành công.");
            }
            catch (DbUpdateException ex)
            {
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");
            }
        }

        public async Task<(IEnumerable<ResponseLichBieuDto> data, PageInfo page)> GetAllLichBieuAsync(ParamLichBieuDto paramLichBieuDto)
        {
            var lichBieus = await _repositoryMaster.LichBieu.GetAllLichBieuAsync(paramLichBieuDto.page, paramLichBieuDto.limit, paramLichBieuDto.search, paramLichBieuDto.sortBy, paramLichBieuDto.sortByOrder, paramLichBieuDto.giangVienId, paramLichBieuDto.tuanId, paramLichBieuDto.boMonId);
            var lichBieuDto = _mapper.Map<IEnumerable<ResponseLichBieuDto>>(lichBieus);
            return (data: lichBieuDto, page: lichBieus!.PageInfo);
        }

        public async Task<IEnumerable<ResponseLichBieuDto>> GetAllLichBieuNoPageAsync(ParamLichBieuSimpleDto paramLichBieuSimpleDto)
        {
            var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(paramLichBieuSimpleDto.lopHocId, false);
            if (lopHoc is null)
            {
                return Enumerable.Empty<ResponseLichBieuDto>();
            }
            var chuongTrinhDaoTao = await _repositoryMaster.ChuongTrinhDaoTao.GetChuongTrinhDaoTaoByKhoaAndNganhIdAsync(lopHoc.NamHoc, lopHoc.NganhId.Value);
            if (chuongTrinhDaoTao is null)
            {
                return Enumerable.Empty<ResponseLichBieuDto>();
            }
            var lichBieus = await _repositoryMaster.LichBieu.GetAllLichBieuNoPageLopHocAsync(paramLichBieuSimpleDto.hocKy, lopHoc.MaLopHoc, chuongTrinhDaoTao.Id, paramLichBieuSimpleDto.tuanId, paramLichBieuSimpleDto.search, paramLichBieuSimpleDto.sortBy, paramLichBieuSimpleDto.sortByOrder, paramLichBieuSimpleDto.namHoc);
            var lichBieuDto = _mapper.Map<IEnumerable<ResponseLichBieuDto>>(lichBieus);
            return lichBieuDto;
        }

        public async Task<ResponseLichBieuDto> GetLichBieuByIdAsync(Guid id, bool trackChanges)
        {
            var lichBieu = await _repositoryMaster.LichBieu.GetLichBieuByIdAsync(id, false);
            if (lichBieu is null)
            {
                throw new LichBieuNotFoundException(id);
            }
            var lichBieuDto = _mapper.Map<ResponseLichBieuDto>(lichBieu);
            _loggerService.LogInfo($"Lấy thành công lịch biểu của id = {lichBieu.Id}");
            return lichBieuDto;
        }

        public async Task UpdateAsync(Guid id, RequestUpdateLichBieuSimpleDto request)
        {
            try
            {
                if (id != request.Id)
                {
                    throw new LichBieuBadRequestException($"Id request và Id lịch biểu không giống nhau!");
                }
                var lichBieu = await _repositoryMaster.LichBieu.GetLichBieuByIdAsync(id, true);
                if (lichBieu is null)
                {
                    throw new LichBieuNotFoundException(id);
                }
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    lichBieu.TietBatDau = request.TietBatDau;
                    lichBieu.TietKetThuc = request.TietKetThuc;
                    lichBieu.Thu = request.Thu;
                    lichBieu.TuanId = request.TuanId;
                    lichBieu.LopHocPhanId = request.LopHocPhanId;
                    lichBieu.PhongHocId = request.PhongHocId;
                    lichBieu.UpdatedAt = DateTime.Now;
                    await Task.CompletedTask;
                });
                _loggerService.LogInfo($"Cập nhật lịch biểu có id = {id} thành công.");
            }catch (DbUpdateException ex)
            {
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
            }
        }


    }
}
