using System.Net;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions;
using Education_assistant.Models.Error;
using Microsoft.AspNetCore.Diagnostics;

namespace Education_assistant.Extensions;

public static class ExceptionExtensions
{
    public static void ConfigureExceptionHandler(this WebApplication app, ILoggerService logger)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    context.Response.StatusCode = contextFeature.Error switch
                    {
                        NotFoundException => StatusCodes.Status404NotFound,
                        BadRequestException => StatusCodes.Status400BadRequest,
                        ExistedException => StatusCodes.Status409Conflict,
                        UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                        ManyRequestException => StatusCodes.Status429TooManyRequests,
                        ForbiddenException => StatusCodes.Status403Forbidden,
                        _ => StatusCodes.Status500InternalServerError
                    };
                    logger.LogError($"Something went wrong: {contextFeature.Error}");
                    await context.Response.WriteAsync(new Error
                    {
                        StatusCode = context.Response.StatusCode,
                        Message = contextFeature.Error.Message
                    }.ToString());
                }
            });
        });
    }
}