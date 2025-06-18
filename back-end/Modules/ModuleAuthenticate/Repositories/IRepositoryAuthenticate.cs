using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleAuthenticate.Repositories;

public interface IRepositoryAuthenticate
{
    Task<TaiKhoan> GetGiangVienByEmailAsync(string email, bool trackChanges);
    Task<TaiKhoan?> GetTaiKhoanByEmailAndTokenAsync(string email, string token, bool trackChanges);
}