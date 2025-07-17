namespace Education_assistant.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddCorsService(this IServiceCollection services, IConfiguration configuration)
    {
        var corsSettings = configuration.GetSection("CorsSetting");
        var allowedOrigins = corsSettings["AllowOrigin"]?.Split(',');
        var allowedMethods = corsSettings["AllowMethods"]?.Split(',');
        var allowedHeaders = corsSettings["AllowHeaders"]?.Split(',');
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        Console.WriteLine($"test 99999999999999999999 {environment}");
        services.AddCors(options =>
        {
            if (environment == "Production")
                options.AddPolicy("ProductionPolicy", builder => builder
                    .AllowAnyOrigin()
                    .WithMethods(allowedMethods!)
                    .WithHeaders(allowedHeaders!)
                    .WithExposedHeaders("x-pagination"));
            else
                options.AddPolicy("DevelopmentPolicy", builder => builder
                    .AllowAnyOrigin()
                    .WithMethods(allowedMethods!)
                    .WithHeaders(allowedHeaders!)
                    .WithExposedHeaders("x-pagination"));
        });

        return services;
    }
}