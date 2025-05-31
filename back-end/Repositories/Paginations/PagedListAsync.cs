using System;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Repositories.Paginations;

public class PagedListAsync<T> : List<T> where T : class
{
    public PageInfo PageInfo { get; set; }
    public PagedListAsync(List<T> items, int count, int page, int limit)
    {
        PageInfo = new PageInfo
        {
            TotalCount = count,
            PageSize = limit,
            CurrentPage = page,
            TotalPages = (int)Math.Ceiling(count / (double)limit)
        };
        AddRange(items);
    }
    public static async Task<PagedListAsync<T>> ToPagedListAsync(IQueryable<T> source, int page, int limit)
    {
        var count = await source.AsNoTracking().CountAsync();
        var items = await source
            .AsNoTracking()
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();
        return new PagedListAsync<T>(items, count, page, limit);
    }
}
