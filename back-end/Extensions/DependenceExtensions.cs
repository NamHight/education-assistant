using System.Text;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.helpers;
using Education_assistant.helpers.implements;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceEmails;
using Education_assistant.Services.ServiceFile;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Education_assistant.Extensions;
// - Lớp này đăng ký cách phụ thuộc liên quan đến ứng dụng trên mỗi services
//   + Quản lý các dịch vụ ứng dụng cốt lõi
//   + Đăng ký các validator (FluentValidation)
//   + Thường bao gồm:
//   + Các service classes
//   + Repositories
//   + Validators
//   + Các interface và implementation

public static class DependenceExtensions
{
    public static IServiceCollection AddDependence(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var assembly = typeof(DependenceExtensions).Assembly;
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "EducationAssistant",
                    ValidAudience = "EducationAssistant",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Cookies["access_token"];
                        if (!string.IsNullOrEmpty(token) && context.Request.Path.StartsWithSegments("/api"))
                            context.Token = token;
                        return Task.CompletedTask;
                    }
                };
            });
        services.AddAuthentication();
        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);
        services.AddSingleton<ILoggerService, LoggerService>();
        services.AddHttpContextAccessor();
        services.AddScoped<ValidationFilter>();
        services.AddScoped<IPasswordHash, PasswordHash>();
        services.AddScoped<IRepositoryMaster, RepositoryMaster>();
        services.AddScoped<IServiceMaster, ServiceMaster>();
        services.AddScoped<IServiceFIle, ServiceFile>();
        services.AddScoped<IDiemSoHelper, DiemSoHelper>();
        services.AddScoped<IServiceEmail, ServiceEmail>();
        
        return services;
    }
}