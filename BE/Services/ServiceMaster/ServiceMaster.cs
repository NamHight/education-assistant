using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Modules.ModuleGiangVien.Services;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Services.ServiceMaster;

public class ServiceMaster : IServiceMaster
{
    private readonly Lazy<IServiceGiangVien> _giangVien;

    public ServiceMaster(IRepositoryMaster repositoryMaster, ILoggerService loggerService)
    {
        _giangVien = new Lazy<IServiceGiangVien>(() => new ServiceGiangVien(repositoryMaster, loggerService));
    }


    public IServiceGiangVien GiangVien => _giangVien.Value;
}