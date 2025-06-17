using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTuan.Repositories;

public interface IRepositoryTuan
{
    Task<PagedListAsync<Tuan>> GetAllTuanAsync(int page, int limit, string search, string sortBy, string sortByOrder);
    Task<Tuan?> GetTuanByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Tuan tuan);
    void UpdateTuan(Tuan tuan);
    void DeleteTuan(Tuan tuan);
}
