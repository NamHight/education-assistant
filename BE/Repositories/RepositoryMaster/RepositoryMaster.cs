using Education_assistant.Context;
using Education_assistant.Modules.ModuleGiangVien.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Education_assistant.Repositories.RepositoryMaster;

public sealed class RepositoryMaster : IRepositoryMaster
{
    private readonly IDbContextFactory<RepositoryContext> _contextFactory;
    private readonly RepositoryContext _repositoryContext;
    private readonly Lazy<IRepositoryGiangVien> _repositoryGiangVien;
    private IDbContextTransaction _transaction;


    public RepositoryMaster(IDbContextFactory<RepositoryContext> contextFactory)
    {
        _contextFactory = contextFactory;
        _repositoryGiangVien = new Lazy<IRepositoryGiangVien>(() => new RepositoryGiangVien(contextFactory));
    }

    public IRepositoryGiangVien GiangVien => _repositoryGiangVien.Value;

    // Chỉ sử dụng ở lớp service thêm xóa sửa 
    public async Task BeginTransactionAsync()
    {
        _transaction = await _repositoryContext.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _transaction.CommitAsync();
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task SaveChangesAsync()
    {
        await _repositoryContext.SaveChangesAsync();
    }

    public void Dispose()
    {
        _transaction.Dispose();
        _repositoryContext.Dispose();
    }
}