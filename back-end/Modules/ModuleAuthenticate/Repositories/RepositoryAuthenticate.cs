using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleAuthenticate.Repositories;

public class RepositoryAuthenticate : RepositoryBase<TaiKhoan>, IRepositoryAuthenticate
{
    public RepositoryAuthenticate(RepositoryContext repositoryContext) : base(repositoryContext)
    {
    }


    public async Task<TaiKhoan> GetGiangVienByEmailAsync(string email, bool trackChanges)
    {
        return await FindByCondition(tk => tk.Email.Equals(email), trackChanges).FirstAsync();
    }
}