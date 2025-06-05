using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.LopHocExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Exceptions.ThrowError.MonHocExceptions;
using Education_assistant.Exceptions.ThrowError.PhongHocExceptions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModulePhongHoc.Services
{
    public class ServicePhongHoc : IServicePhongHoc
    {
        private readonly ILoggerService _loggerService;
        private readonly IRepositoryMaster _repositoryMaster;
        private readonly IMapper _mapper;
        public ServicePhongHoc(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
        {
            _repositoryMaster = repositoryMaster;
            _loggerService = loggerService;
            _mapper = mapper;
        }
        public async Task<ResponsePhongHocDto> CreateAsync(RequestAddPhongHocDto request)
        {
            if (request is null)
            {
                throw new PhongHocBadRequestException("Thông tin phòng học đầu vào không đủ thông tin!");
            }
            var newPhongHoc = _mapper.Map<PhongHoc>(request);
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                await _repositoryMaster.PhongHoc.CreateAsync(newPhongHoc);
            });
            _loggerService.LogInfo("Thêm thông tin phòng học thành công.");
            var phongHocDto = _mapper.Map<ResponsePhongHocDto>(newPhongHoc);
            return phongHocDto;
        }

        public async Task DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new PhongHocBadRequestException($"Phòng học với {id} không được bỏ trống!");
            }
            var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            if (phongHoc is null)
            {
                throw new PhongHocNotFoundException(id);
            }
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.PhongHoc.DeletePhongHoc(phongHoc);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo($"Xóa phòng học có id = {id} thành công.");
        }

        public async Task<(IEnumerable<ResponsePhongHocDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamPageAndSearchBaseDto paramBaseDto)
        {
            var phongHocs = await _repositoryMaster.PhongHoc.GetAllPaginatedAndSearchOrSortAsync(paramBaseDto.page, paramBaseDto.limit, paramBaseDto.search);
            var phongHocDto = _mapper.Map<IEnumerable<ResponsePhongHocDto>>(phongHocs);
            return (data: phongHocDto, page: phongHocs!.PageInfo);
        }

        public async Task<ResponsePhongHocDto> GetPhongHocByIdAsync(Guid id, bool trackChanges)
        {
            var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            if (phongHoc is null)
            {
                throw new LopHocNotFoundException(id);
            }
            var phongHocDto = _mapper.Map<ResponsePhongHocDto>(phongHoc);
            _loggerService.LogInfo($"Lấy thành công phòng học có id = {phongHocDto.Id}.");
            return phongHocDto;
        }

        public async Task UpdateAsync(Guid id, RequestUpdatePhongHocDto request)
        {
            if (id != request.Id)
            {
                throw new PhongHocBadRequestException($"Id request và Id phòng học khác nhau!");
            }
            var phongHoc = await _repositoryMaster.PhongHoc.GetPhongHocByIdAsync(id, false);
            if (phongHoc is null)
            {
                throw new PhongHocNotFoundException(id);
            }
            var phongHocUpdate = _mapper.Map<PhongHoc>(request);
            phongHocUpdate.UpdatedAt = DateTime.Now;
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                _repositoryMaster.PhongHoc.UpdatePhongHoc(phongHocUpdate);
                await Task.CompletedTask;
            });
            _loggerService.LogInfo($"Cập nhật phòng học có id = {id} thành công.");
        }
    }
}
