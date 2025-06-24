using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public interface IRepositoryTruong
{
    Task<Dictionary<string, string>> GetTruongAsync(bool trackChanges);
    Task<IEnumerable<Truong>> GetAllTruongAsync();
    Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task<Truong?> GetTruongByKeyAsync(string key, bool trackChanges);
    Task CreateAsync(Truong truong);
    void UpdateTruong(Truong truong);
    void DeleteTruong(Truong truong);
}