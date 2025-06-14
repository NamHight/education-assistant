using System;
using Education_assistant.Services.ServiceEmails.DTOs.Request;


namespace Education_assistant.Services.ServiceEmails;

public interface IServiceEmail
{
    Task SendEmailComfirmAsync(RequestEmailTokenDto model, string url, string template);
    Task<RequestEmailTokenDto?> HandleSendEmail(string email);
    Task<bool> ValidateTokenPasswordAsync(string token);
}
