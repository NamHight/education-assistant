using Education_assistant.Modules.ModuleGiangVien.Repositories;

namespace Education_assistant.Repositories.RepositoryMaster;

public interface IRepositoryMaster : IDisposable
{
    IRepositoryGiangVien GiangVien { get; }

    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task SaveChangesAsync();
}