using Education_assistant.Context;
using Education_assistant.Modules.ModuleGiangVien.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Education_assistant.Repositories.RepositoryMaster;

public class RepositoryMaster : IRepositoryMaster
{
    private readonly IDbContextFactory<RepositoryContext> _contextFactory;
    private readonly RepositoryContext _repositoryContext;
    private readonly Lazy<IRepositoryGiangVien> _repositoryGiangVien;
    private bool _disposed;
    private IDbContextTransaction _transaction;


    public RepositoryMaster(RepositoryContext repositoryContext, IDbContextFactory<RepositoryContext> contextFactory)
    {
        _repositoryContext = repositoryContext;
        _contextFactory = contextFactory;
        _repositoryGiangVien = new Lazy<IRepositoryGiangVien>(() => new RepositoryGiangVien(repositoryContext));
    }

    public IRepositoryGiangVien GiangVien => _repositoryGiangVien.Value;

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
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    // Chỉ sử dụng ở lớp service thêm xóa sửa 
    public RepositoryContext CreateNewContext()
    {
        return _contextFactory.CreateDbContext();
    }

    public async Task<RepositoryContext> CreateNewContextAsync()
    {
        return await _contextFactory.CreateDbContextAsync();
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _transaction?.Dispose();
                _repositoryContext?.Dispose();
            }

            _disposed = true;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_transaction != null) await _transaction.DisposeAsync();

        if (_repositoryContext != null) await _repositoryContext.DisposeAsync();

        Dispose(false);
        GC.SuppressFinalize(this);
    }
}