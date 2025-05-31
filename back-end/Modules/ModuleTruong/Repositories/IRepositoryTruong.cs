using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public interface IRepositoryTruong
{
    Task<PagedListAsync<Truong>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search);  
    Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Truong truong);
    void UpdateTruong(Truong truong);
    void DeleteTruong(Truong truong);
}
