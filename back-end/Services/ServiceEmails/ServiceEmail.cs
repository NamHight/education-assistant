using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceEmails.DTOs.Response;
using Education_assistant.Services.ServiceMaster;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Education_assistant.Services.ServiceEmails;

public class ServiceEmail : IServiceEmail
{
    private const string templatePath = @"Templates/{0}.html";
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoggerService _loggerService;
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly IServiceMaster _serviceMaster;

    public ServiceEmail(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IConfiguration config,
        IHttpContextAccessor httpContextAccessor, IServiceMaster serviceMaster)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _config = config;
        _httpContextAccessor = httpContextAccessor;
        _serviceMaster = serviceMaster;
    }

    public async Task SendEmailForgotPassword(string email)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null) throw new GiangVienBadRequestException("Email không được để trống!.");
        taiKhoan.ResetPassword = _serviceMaster.Authenticate.GenerateToken(taiKhoan);
        taiKhoan.ResetPasswordExpires = DateTime.Now.AddMinutes(5);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Update resetpassword thành công!");


        try
        {
            var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByEmailAsync(email, false);
            var temp = string.Empty;
            if (giangVien is not null)
                temp = giangVien.HoTen;
            else
                temp = taiKhoan.Email;
            var context = _httpContextAccessor.HttpContext;
            var url =
                $"{context!.Request.Scheme}://{context.Request.Host}/api/Authenticate/forgot-password-confirm/?email={email}&token={taiKhoan.ResetPassword}";
            Console.WriteLine("Link: " + url);
            Console.WriteLine("Name: " + temp);
            var responseEmail = new ResponseEmailDto
            {
                Recipient = taiKhoan.Email,
                Attachments = new List<KeyValuePair<string, string>>
                {
                    new("{{Link}}", url),
                    new("{{Name}}", temp!)
                }
            };
            await SendEmailAsyncWithTemplate("Cập nhật mật khẩu", responseEmail, "ConfirmTemplate");
        }
        catch (Exception ex)
        {
            _loggerService.LogError("Xảy ra lỗi khi cấu hình email!");
            throw new Exception(ex.Message);
        }
    }

    private async Task SendEmailAsyncWithTemplate(string title, ResponseEmailDto model, string template)
    {
        model.Subject = title;
        model.Body = UpdatePlaceHolder(GetEmailTemplate(template), model.Attachments);
        await SendMailAsync(model);
    }

    private async Task SendMailAsync(ResponseEmailDto model)
    {
        _loggerService.LogInfo("Gửi email giảng viên thành công.");
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["EmailSetting:From"]));
        email.To.Add(MailboxAddress.Parse(model.Recipient));
        email.Subject = model.Subject;

        var builder = new BodyBuilder { HtmlBody = model.Body };
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_config["EmailSetting:SmtpServer"], int.Parse(_config["EmailSetting:Port"]!),
            SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_config["EmailSetting:Username"], _config["EmailSetting:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    private string UpdatePlaceHolder(string text, List<KeyValuePair<string, string>>? placeHolder)
    {
        if (!string.IsNullOrWhiteSpace(text) && placeHolder is not null)
            foreach (var item in placeHolder)
                if (text.Contains(item.Key))
                    text = text.Replace(item.Key, item.Value);

        return text;
    }

    private string GetEmailTemplate(string nameTemplate)
    {
        var template = File.ReadAllText(string.Format(templatePath, nameTemplate));
        return template;
    }
}