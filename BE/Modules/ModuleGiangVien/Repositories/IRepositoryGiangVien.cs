using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories;

public interface IRepositoryGiangVien
{
    Task<IEnumerable<GiangVien>> GetAllAsync(bool trackChanges);
}