using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public class RepositoryTruong : RepositoryBase<Truong>, IRepositoryTruong
{
    public RepositoryTruong(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(Truong truong)
    {
        await Create(truong);
    }

    public void DeleteTruong(Truong truong)
    {
        Delete(truong);
    }

    public async Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateTruong(Truong truong)
    {
        Update(truong);
    }
}