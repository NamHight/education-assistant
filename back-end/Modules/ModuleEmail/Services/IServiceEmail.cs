using System;
using Education_assistant.Modules.ModuleEmail.DTOs.Request;

namespace Education_assistant.Modules.ModuleEmail.Services;

public interface IServiceEmail
{
    Task SendEmailComfirmAsync(string email, string nameGiangVien, string url);
    Task<RequestEmailTokenDto?> HandleSendEmail(string email);
}
