using Education_assistant.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Extensions;

// -Lớp trình bày sử dụng đăng ký dịch vụ liên quan đến controller trên api
//   + Tập trung hóa cấu hình phần giao diện
//   + Dễ dàng mở rộng khi thêm các controller mới
//   + Tách biệt phần giao diện với các lớp khác
//   + websocket
public static class PresentationExtensions
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        var assembly = typeof(PresentationExtensions).Assembly;
        services.AddControllers()
            .AddApplicationPart(assembly);
        services.AddAutoMapper(typeof(MapperProfile).Assembly);
        services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });
        return services;
    }
}