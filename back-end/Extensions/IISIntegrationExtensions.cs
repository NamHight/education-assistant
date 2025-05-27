namespace Education_assistant.Extensions;

public static class IISIntegrationExtensions
{
    public static IServiceCollection AddIISIntegration(this IServiceCollection services)
    {
        return services.Configure<IISOptions>(options => { });
    }
}