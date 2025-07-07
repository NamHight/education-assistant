using System;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
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

    public async Task<List<ResponseThongKeTopSinhVienDto>> ThongKeTopSinhVienGPAAsync()
    {
        return await _repositoryMaster.ThongKe.ThongKeTopSinhVienGPAAsync();
    }

    public async Task<List<ResponseThongKeTrongNamDto>> ThongKetQuaMonTrongNam()
    {
        return await _repositoryMaster.ThongKe.ThongKetQuaMonTrongNam();
    }

    public async Task<List<ResponseThongKeTrongNamDto>> ThongKetThiLaiTrongNam(int nam)
    {
        if (nam <= 1900)
        {
            nam = DateTime.Now.Year;
        }   
        return await _repositoryMaster.ThongKe.ThongKetThiLaiTrongNam(nam); 
    }

    public async Task<Dictionary<string, double>> ThongKetTinhTrangHocTap()
    {
        return await _repositoryMaster.ThongKe.ThongKetTinhTrangHocTap();
    }
}
