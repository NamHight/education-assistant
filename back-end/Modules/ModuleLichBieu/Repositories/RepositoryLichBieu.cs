using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleLichBieu.Repositories;

public class RepositoryLichBieu : RepositoryBase<LichBieu>, IRepositoryLichBieu
{
    public RepositoryLichBieu(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(LichBieu lichBieu)
    {
        await Create(lichBieu);
    }

    public void DeleteLichBieu(LichBieu lichBieu)
    {
        Delete(lichBieu);
    }

    public async Task<PagedListAsync<LichBieu>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit)
    {
        return await PagedListAsync<LichBieu>.ToPagedListAsync(_context.LichBieus, page, limit);
    }

    public async Task<LichBieu?> GetLichBieuByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }
    public void UpdateLichBieu(LichBieu lichBieu)
    {
        Update(lichBieu);
    }
}
