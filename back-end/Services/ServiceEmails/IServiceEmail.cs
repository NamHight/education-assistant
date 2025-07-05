using System;
using Education_assistant.Services.ServiceEmails.DTOs.Request;


namespace Education_assistant.Services.ServiceEmails;

public interface IServiceEmail
{
    Task SendEmailForgotPassword(string email);
    //Test
    Task SendOTPForgotPassword_Mobile(string email);
    Task<bool> VerifyOTP_Mobile(string email, string otpCode);
    Task ResetPasswordWithOTP_Mobile(string email, string otpCode, string newPassword);
}
