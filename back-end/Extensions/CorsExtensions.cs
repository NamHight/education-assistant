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
        services.AddCors(options =>
        {
            if (environment == "Development")
                options.AddPolicy("ProductionPolicy", builder => builder
                    .WithOrigins(allowedOrigins!)
                    .WithMethods(allowedMethods!)
                    .WithHeaders(allowedHeaders!)
                    .WithExposedHeaders("x-pagination")
                    .AllowCredentials());
            options.AddPolicy("DevelopmentPolicy", builder => builder
                .WithOrigins(allowedOrigins!)
                .WithMethods(allowedMethods!)
                .WithHeaders(allowedHeaders!)
                .WithExposedHeaders("x-pagination")
                .AllowCredentials());
        });

        return services;
    }
}