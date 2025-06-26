using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public interface IRepositoryTruong
{
    Task<Dictionary<string, string>> GetTruongAsync(bool trackChanges);
    Task<PagedListAsync<Truong>> GetAllTruongAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder);
    Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task<Truong?> GetTruongByKeyAsync(string key, bool trackChanges);
    Task CreateAsync(Truong truong);
    void UpdateTruong(Truong truong);
    void DeleteTruong(Truong truong);
}