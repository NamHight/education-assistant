using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.MonHocExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Param;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLopHoc.Services
{
    public class ServiceLopHoc : IServiceLopHoc
    {
        private readonly ILoggerService _loggerService;
        private readonly IRepositoryMaster _repositoryMaster;
        private readonly IMapper _mapper;
        public ServiceLopHoc(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
        {
            _repositoryMaster = repositoryMaster;
            _loggerService = loggerService;
            _mapper = mapper;
        }

        public async Task<ResponseLopHocDto> CreateAsync(RequestAddLopHocDto request)
        {
            try
            {
                var newLopHoc = _mapper.Map<LopHoc>(request);
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    await _repositoryMaster.LopHoc.CreateAsync(newLopHoc);
                });
                _loggerService.LogInfo("Thêm thông tin lớp học thành công.");
                var lopHocDto = _mapper.Map<ResponseLopHocDto>(newLopHoc);
                return lopHocDto;
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
                    throw new MonHocBadRequestException($"Lớp học với {id} không được bỏ trống!");
                }
                var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(id, false);
                if (lopHoc is null)
                {
                    throw new LopHocNotFoundException(id);
                }
                lopHoc.DeletedAt = DateTime.Now;
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    _repositoryMaster.LopHoc.UpdateLopHoc(lopHoc);
                    await Task.CompletedTask;
                });
                _loggerService.LogInfo("Xóa lớp học thành công.");
            }
            catch (DbUpdateException ex)
            {
                var inner = ex.InnerException?.Message?.ToLower();
                if (ex.InnerException != null && (inner!.Contains("foreign key") ||
                            inner.Contains("reference constraint") ||
                            inner.Contains("violates foreign key constraint") ||
                            inner.Contains("cannot delete or update a parent row")))
                {
                    throw new LopHocBadRequestException("Không thể xóa lớp học vì có ràng buộc khóa ngoại!.");
                }
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");
            }
        }

        public async Task<(IEnumerable<ResponseLopHocDto> data, PageInfo page)> GetAllLopHocAsync(ParamLopHocDto paramLopHocDto)
        {
            var lopHocs = await _repositoryMaster.LopHoc.GetAllLopHocAsync(paramLopHocDto.page, paramLopHocDto.limit, paramLopHocDto.search, paramLopHocDto.sortBy, paramLopHocDto.sortByOrder);
            var lopHocDto = _mapper.Map<IEnumerable<ResponseLopHocDto>>(lopHocs);
            return (data: lopHocDto, page: lopHocs!.PageInfo);
        }

        public async Task<IEnumerable<ResponseLopHocDto>> GetAllLopHocNoPageAsync()
        {
            var lopHocs = await _repositoryMaster.LopHoc.GetAllLopHocNoPageAsync();
            var lopHocDtos = _mapper.Map<IEnumerable<ResponseLopHocDto>>(lopHocs);
            return lopHocDtos;
        }

        public async Task<ResponseLopHocDto> GetLopHocByIdAsync(Guid id, bool trackChanges)
        {
            var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(id, false);
            if (lopHoc is null)
            {
                throw new LopHocNotFoundException(id);
            }
            var lopHocDto = _mapper.Map<ResponseLopHocDto>(lopHoc);
            _loggerService.LogInfo($"Lấy thành công lớp học có id = {lopHocDto.Id}.");
            return lopHocDto;
        }

        public async Task UpdateAsync(Guid id, RequestUpdateLopHocDto request)
        {
            try
            {
                if (id != request.Id)
                {
                    throw new LopHocBadRequestException($"Id request và Id lớp học khác nhau!");
                }
                var lopHoc = await _repositoryMaster.LopHoc.GetLopHocByIdAsync(id, true);
                if (lopHoc is null)
                {
                    throw new LopHocNotFoundException(id);
                }
                await _repositoryMaster.ExecuteInTransactionAsync(async () =>
                {
                    lopHoc.MaLopHoc = request.MaLopHoc;
                    lopHoc.SiSo = request.SiSo;
                    lopHoc.NamHoc = request.NamHoc;
                    lopHoc.GiangVienId = request.GiangVienId;
                    lopHoc.NganhId = request.NganhId;
                    lopHoc.UpdatedAt = DateTime.Now;
                    await Task.CompletedTask;
                });
                _loggerService.LogInfo("Cập nhật lớp học thành công.");
            }catch (DbUpdateException ex)
            {
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");   
            }
        }
    }
}
