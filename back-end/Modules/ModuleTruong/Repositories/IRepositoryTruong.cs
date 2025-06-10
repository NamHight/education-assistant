using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleTruong.Repositories;

public interface IRepositoryTruong
{
    Task<Truong?> GetTruongByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(Truong truong);
    void UpdateTruong(Truong truong);
    void DeleteTruong(Truong truong);
}