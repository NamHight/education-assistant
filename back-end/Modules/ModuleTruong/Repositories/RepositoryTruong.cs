using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using Education_assistant.Extensions;

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

    public async Task<Dictionary<string, string>> GetTruongAsync(bool trackChanges)
    {
        return await FindAll(trackChanges).ToDictionaryAsync(e => e.Key, e => e.Value);
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
