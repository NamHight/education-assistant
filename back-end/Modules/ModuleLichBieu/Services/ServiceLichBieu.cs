using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.LichBieuExceptions;
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
            if (request.ListTuanId is null || request.ListTuanId.Count() == 0)
            {
                throw new TuanBadRequestException("Danh sách tuần không được bỏ trống!.");
            }
            var listLichBieu = new List<LichBieu>();
            foreach (var tuanid in request.ListTuanId!)
            {
                foreach (var lichBieuDto in request.LichBieus!)
                {
                    var lichBieu = _mapper.Map<LichBieu>(request);
                    lichBieu.Id = Guid.NewGuid();
                    lichBieu.TietBatDau = lichBieuDto.TietBatDau;
                    lichBieu.TietKetThuc = lichBieuDto.TietKetThuc;
                    lichBieu.Thu = lichBieuDto.Thu;
                    lichBieu.TuanId = tuanid;
                    lichBieu.LopHocPhanId = lichBieuDto.LopHocPhanId;
                    lichBieu.PhongHocId = lichBieuDto.PhongHocId;
                    listLichBieu.Add(lichBieu);
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
            var lichBieus = await _repositoryMaster.LichBieu.GetAllLichBieuAsync(paramLichBieuDto.page, paramLichBieuDto.limit, paramLichBieuDto.search, paramLichBieuDto.sortBy, paramLichBieuDto.sortByOrder, paramLichBieuDto.namHoc, paramLichBieuDto.giangVienId, paramLichBieuDto.tuanId, paramLichBieuDto.boMonId);
            var lichBieuDto = _mapper.Map<IEnumerable<ResponseLichBieuDto>>(lichBieus);
            return (data: lichBieuDto, page: lichBieus!.PageInfo);
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
                var lichBieu = await _repositoryMaster.LichBieu.GetLichBieuByIdAsync(id, false);
                if (lichBieu is null)
                {
                    throw new LichBieuNotFoundException(id);
                }
                lichBieu.TietBatDau = request.TietBatDau;
                lichBieu.TietKetThuc = request.TietKetThuc;
                lichBieu.Thu = request.Thu;
                lichBieu.LopHocPhanId = request.LopHocPhanId;
                lichBieu.PhongHocId = request.PhongHocId;
                lichBieu.UpdatedAt = DateTime.Now;
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    _repositoryMaster.LichBieu.UpdateLichBieu(lichBieu);
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
