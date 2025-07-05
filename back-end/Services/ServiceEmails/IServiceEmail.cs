using System;
using Education_assistant.Services.ServiceEmails.DTOs.Request;


namespace Education_assistant.Services.ServiceEmails;

public interface IServiceEmail
{
    Task SendEmailForgotPassword(string email);
    //Test
    Task SendOTPForgotPassword(string email);
    Task<bool> VerifyOTP(string email, string otpCode);
    Task ResetPasswordWithOTP(string email, string otpCode, string newPassword);
}
