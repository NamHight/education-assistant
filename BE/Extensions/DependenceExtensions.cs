﻿using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceMaster;
using FluentValidation;

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
    public static IServiceCollection AddDependence(this IServiceCollection services)
    {
        var assembly = typeof(DependenceExtensions).Assembly;

        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);
        services.AddSingleton<ILoggerService, LoggerService>();
        services.AddScoped<IRepositoryMaster, RepositoryMaster>();
        services.AddScoped<IServiceMaster, ServiceMaster>();

        return services;
    }
}