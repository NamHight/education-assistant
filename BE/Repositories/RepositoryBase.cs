using System.Linq.Expressions;
using Education_assistant.Context;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Repositories;

public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    private readonly IDbContextFactory<RepositoryContext> _contextFactory;
    private RepositoryContext _context;

    protected RepositoryBase(IDbContextFactory<RepositoryContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    protected RepositoryContext Context
    {
        get
        {
            if (_context == null)
                _context = _contextFactory.CreateDbContext();
            return _context;
        }
    }

    public IQueryable<T> FindAll(bool trackChanges)
    {
        return !trackChanges
            ? Context.Set<T>().AsNoTracking()
            : Context.Set<T>();
    }

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges)
    {
        return !trackChanges
            ? Context.Set<T>().Where(expression).AsNoTracking()
            : Context.Set<T>().Where(expression);
    }

    public async Task Create(T entity)
    {
        await Context.Set<T>().AddAsync(entity);
    }

    public void Update(T entity)
    {
        Context.Set<T>().Update(entity);
    }

    public void Delete(T entity)
    {
        Context.Set<T>().Remove(entity);
    }

    public void Dispose()
    {
        _context?.Dispose();
    }
}