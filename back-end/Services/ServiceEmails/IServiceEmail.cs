using System;
using Education_assistant.Services.ServiceEmails.DTOs.Request;


namespace Education_assistant.Services.ServiceEmails;

public interface IServiceEmail
{
    Task SendEmailForgotPassword(string email);
}
