using System.Linq.Expressions;
using Education_assistant.Context;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Repositories;

public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    private readonly RepositoryContext _context;

    protected RepositoryBase(RepositoryContext repositoryContext)
    {
        _context = repositoryContext;
    }


    public IQueryable<T> FindAll(bool trackChanges)
    {
        return !trackChanges
            ? _context.Set<T>().AsNoTracking()
            : _context.Set<T>();
    }

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges)
    {
        return !trackChanges
            ? _context.Set<T>().Where(expression).AsNoTracking()
            : _context.Set<T>().Where(expression);
    }

    public async Task Create(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public void Dispose()
    {
        _context?.Dispose();
    }
}