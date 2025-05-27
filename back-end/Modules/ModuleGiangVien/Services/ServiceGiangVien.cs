using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Models;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public sealed class ServiceGiangVien : IServiceGiangVien
{
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceGiangVien(IRepositoryMaster repositoryMaster, ILoggerService loggerService)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
    }

    public async Task<IEnumerable<GiangVien>> GetAllAsync(bool trackChanges)
    {
        try
        {
            _loggerService.LogInfo("Get All Giang Vien");
            return await _repositoryMaster.GiangVien.GetAllAsync(trackChanges);
        }
        catch (Exception e)
        {
            _loggerService.LogError($"Something went wrong in the {nameof(GetAllAsync)} service method: {e}");
            throw;
        }
    }
}