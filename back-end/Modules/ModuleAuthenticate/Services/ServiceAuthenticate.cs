using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Modules.ModuleAuthenticate.Services;

public class ServiceAuthenticate : IServiceAuthenticate
{
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceAuthenticate(ILoggerService loggerService, IRepositoryMaster repositoryMaster, IMapper mapper)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
    }
    

}