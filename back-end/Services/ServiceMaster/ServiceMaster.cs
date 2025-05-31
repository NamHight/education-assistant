using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Modules.ModuleGiangVien.Services;
using Education_assistant.Modules.ModuleKhoa.Services;
using Education_assistant.Modules.ModuleMonHoc.Services;
using Education_assistant.Modules.ModuleTruong.Services;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Services.ServiceMaster;

public class ServiceMaster : IServiceMaster
{
    private readonly Lazy<IServiceGiangVien> _giangVien;
    private readonly Lazy<IServiceTruong> _truong;
    private readonly Lazy<IServiceKhoa> _khoa;
    private readonly Lazy<IServiceMonHoc> _monHoc;

    public ServiceMaster(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper)
    {
        _giangVien = new Lazy<IServiceGiangVien>(() => new ServiceGiangVien(repositoryMaster, loggerService));
        _truong = new Lazy<IServiceTruong>(() => new ServiceTruong(repositoryMaster, loggerService, mapper));
        _khoa = new Lazy<IServiceKhoa>(() => new ServiceKhoa(repositoryMaster, loggerService, mapper));
        _monHoc = new Lazy<IServiceMonHoc>(() => new ServiceMonHoc(repositoryMaster, loggerService, mapper));
    }


    public IServiceGiangVien GiangVien => _giangVien.Value;
    public IServiceTruong Truong => _truong.Value;
    public IServiceKhoa Khoa => _khoa.Value;
    public IServiceMonHoc MonHoc => _monHoc.Value;
}