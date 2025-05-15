namespace Education_assistant.Extensions;

public static class EnvExtensions
{
    public static IServiceCollection AddEnv(this IServiceCollection services, IConfiguration configuration)
    {
        configuration["ConnectionStrings:DefaultConnection"] =
            Environment.GetEnvironmentVariable("CONNECTION_DATABASE_STRING");
        return services;
    }
}