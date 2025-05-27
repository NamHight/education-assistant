using Education_assistant.Context;
using Education_assistant.Modules.ModuleGiangVien.Repositories;

namespace Education_assistant.Repositories.RepositoryMaster;

public interface IRepositoryMaster : IDisposable
{
    IRepositoryGiangVien GiangVien { get; }

    RepositoryContext CreateNewContext();
    Task<RepositoryContext> CreateNewContextAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task SaveChangesAsync();
}