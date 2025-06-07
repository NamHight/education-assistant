using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;

namespace Education_assistant.Modules.ModuleAuthenticate.Repositories;

public class RepositoryAuthenticate : RepositoryBase<TaiKhoan>, IRepositoryAuthenticate
{
    public RepositoryAuthenticate(RepositoryContext repositoryContext) : base(repositoryContext)
    {
    }
    
    
}