
using System.Linq.Expressions;

namespace Education_assistant.Extensions;

public static class QueryableExtentions
{
    public static IQueryable<T> SearchBy<T>(
        this IQueryable<T> source,
        string? searchTerm,
        Expression<Func<T, string>> propertySelector)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return source;

        var keywords = searchTerm.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                                    .Select(key => key.ToLower())
                                    .ToArray();

        if (keywords.Length == 0) return source;
        var parameter = propertySelector.Parameters[0];
        var property = propertySelector.Body;

        //convert property vè lowercase để tìm kiếm không biệt hoa thường 
        var toLowerMethod = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!;
        var loweredProperty = Expression.Call(property, toLowerMethod);
        //ghép các điều kiện contains cho từng từ khóa (and logic)
        Expression? combined = null;
        var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) });

        foreach (var keyword in keywords)
        {
            var keywordConstant = Expression.Constant(keyword);
            var containsExpr = Expression.Call(loweredProperty, containsMethod!, keywordConstant);

            combined = combined == null ? containsExpr : Expression.AndAlso(combined, containsExpr);
        }

        var lambda = Expression.Lambda<Func<T, bool>>(combined!, parameter);
        return source.Where(lambda);
    }
    public static IQueryable<T> SortByOptions<T>(this IQueryable<T> source, string? sortBy, string? SortOrder, Dictionary<string, Expression<Func<T, object>>> optiops)
    {
        if (string.IsNullOrWhiteSpace(sortBy)) return source;
        var key = sortBy.ToLower();
        if (!optiops.TryGetValue(key, out var keySelector))
        {
            keySelector = optiops.First().Value;
        }
        return string.Equals(SortOrder, "desc", StringComparison.OrdinalIgnoreCase)
        ? source.OrderByDescending(keySelector) 
        : source.OrderBy(keySelector);
    }
}
