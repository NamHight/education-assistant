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
        Console.WriteLine(
            "999999999 {0} {1} {2} {3} {4}",
            string.Join(",", allowedOrigins ?? new string[0]),
            string.Join(",", allowedMethods ?? new string[0]),
            string.Join(",", allowedHeaders ?? new string[0]),
            environment,
            corsSettings
        );
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