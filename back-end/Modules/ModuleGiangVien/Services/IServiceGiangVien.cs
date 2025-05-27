using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public interface IServiceGiangVien
{
    Task<IEnumerable<GiangVien>> GetAllAsync(bool trackChanges);
}