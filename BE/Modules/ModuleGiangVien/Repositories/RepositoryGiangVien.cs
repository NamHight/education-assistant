using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories;

public class RepositoryGiangVien : RepositoryBase<GiangVien>, IRepositoryGiangVien
{
    public RepositoryGiangVien(RepositoryContext repositoryContext) : base(repositoryContext)
    {
    }

    public async Task<IEnumerable<GiangVien>> GetAllAsync(bool trackChanges)
    {
        return await FindAll(trackChanges).ToListAsync();
    }
}