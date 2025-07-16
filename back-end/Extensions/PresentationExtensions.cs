using System.Text;
using Education_assistant.Mappers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace Education_assistant.Extensions;

// -Lớp trình bày sử dụng đăng ký dịch vụ liên quan đến controller trên api
//   + Tập trung hóa cấu hình phần giao diện
//   + Dễ dàng mở rộng khi thêm các controller mới
//   + Tách biệt phần giao diện với các lớp khác
//   + websocket
public static class PresentationExtensions
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        var assembly = typeof(PresentationExtensions).Assembly;
        var jwtSettings = configuration.GetSection("Jwt");
        services.AddControllers()
            .AddApplicationPart(assembly)
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("CustomJWT", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    ClockSkew = TimeSpan.Zero,
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
        services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy =>
            {
                policy.AddAuthenticationSchemes("CustomJWT");
                policy.RequireAuthenticatedUser();
                policy.RequireRole("1");
            });
            options.AddPolicy("QLKhoa", policy =>
            {
                policy.AddAuthenticationSchemes("CustomJWT");
                policy.RequireAuthenticatedUser();
                policy.RequireRole("1", "2");
            });
            options.AddPolicy("GiangVien", policy =>
            {
                policy.AddAuthenticationSchemes("CustomJWT");
                policy.RequireAuthenticatedUser();
                policy.RequireRole("1", "2", "3");
            });
        });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Education assistant", Version = "v1" });
            // Thêm phần JWT Bearer Authorization
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Nhập JWT token vào đây:",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });


        services.AddAutoMapper(typeof(MapperProfile).Assembly);
        services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });
        return services;
    }
}