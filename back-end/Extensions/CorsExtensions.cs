namespace Education_assistant.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddCorsService(this IServiceCollection services, IConfiguration configuration)
    {
        var corsSettings = configuration.GetSection("CorsSetting");
        var allowedOrigins = corsSettings["AllowedOrigins"]?.Split(',');
        services.AddCors(options =>
        {
            if (allowedOrigins?.Length > 0)
                options.AddPolicy("ProductionPolicy", builder => builder
                    .WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            options.AddPolicy("DevelopmentPolicy", builder => builder
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());
        });

        return services;
    }
}