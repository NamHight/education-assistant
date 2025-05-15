using Education_assistant.Context;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Extensions;

// Database context
// Caching (Redis, MemoryCache)
// Các dịch vụ hạ tầng khác (email, file storage...)
// Authentication/Authorization

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<IISOptions>(options => { });
        //kết nối với database
        services.AddPooledDbContextFactory<RepositoryContext>(
            options =>
            {
                options.UseMySql(configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection")),
                    option => { option.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null); }
                );
            }, 150);
        return services;
    }
}