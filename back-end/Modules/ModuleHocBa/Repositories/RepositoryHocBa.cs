using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public class RepositoryHocBa : RepositoryBase<HocBa>, IRepositoryHocBa
{
    public RepositoryHocBa(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(HocBa hocBa)
    {
        await Create(hocBa);
    }

    public void DeleteHocBa(HocBa hocBa)
    {
        Delete(hocBa);
    }

    public async Task<PagedListAsync<HocBa>> GetAllHocBaAsync(int page, int limit, string search, string sortBy, string sortByOrder)
    {
        return await PagedListAsync<HocBa>.ToPagedListAsync(_context.HocBas!
                                                    .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<HocBa, object>>>
                                                    {
                                                        ["createat"] = item => item.CreatedAt,
                                                        ["updateat"] = item => item.UpdatedAt!,
                                                        ["lanhoc"] = item => item.LanHoc,
                                                        ["ketqua"] = item => item.KetQua!,
                                                    }).AsNoTracking(), page, limit);
    }

    public async Task<IEnumerable<HocBa>> GetAllHocBaByIdAsync(List<Guid> ids)
    {
        return await _context.HocBas!.Where(item => ids.Contains(item.Id)).ToListAsync();
    }

    public async Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateHocBa(HocBa hocBa)
    {
        Update(hocBa);
    }
}
