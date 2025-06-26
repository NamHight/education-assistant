using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;
using Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;
using Education_assistant.Modules.ModuleThongKe.DTOs.Param;
using Education_assistant.Modules.ModuleThongKe.DTOs.Response;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Modules.ModuleThongKe.Services;

public class ServiceThongKe : IServiceThongKe
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceThongKe(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    public async Task<ResponsePassFailPointClassDto?> GetPassFailDiemSoAsync(ParamCountPointThongKeDto paramCountPointThongKeDto)
    {
        if (paramCountPointThongKeDto.lopHocPhanId == Guid.Empty)
        {
            throw new LopHocPhanBadRequestException($"Id lớp học phần không được bỏ trống");
        }
        var diemSo = await _repositoryMaster.ThongKe.GetPassFailDiemSoAsync(paramCountPointThongKeDto.lopHocPhanId);
        var diemSoDto = _mapper.Map<ResponsePassFailPointClassDto>(diemSo);
        return diemSoDto;
    }

    public async Task<List<ResponseTopStudentRawDto>> GetTopSinhVienLopHocPhanAsync(ParamTopStudentByClassThongKeDDto paramTopStudentByClassThongKeDDto)
    {
        if (paramTopStudentByClassThongKeDDto.khoa < 1)
        {
            throw new ChuongTrinhDaoTaoBadRequestException($"Khóa của chương trình đào tạo không được bỏ trống.");
        }
        if (paramTopStudentByClassThongKeDDto.hocKy < 1)
        {
            throw new ChiTietChuongTrinhDaoTaoBadRequestException($"Học kỳ của chi tiết chương trình đào tạo không được bỏ trống.");
        }
        var sinhViens = await _repositoryMaster.ThongKe.GetTopSinhVienLopHocPhanAsync(paramTopStudentByClassThongKeDDto.khoa, paramTopStudentByClassThongKeDDto.hocKy);
        var sinhVienDtos = _mapper.Map<List<ResponseTopStudentRawDto>>(sinhViens);
        return sinhVienDtos;
    }
}
