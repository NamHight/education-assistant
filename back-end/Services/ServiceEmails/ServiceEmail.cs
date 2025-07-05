using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.helpers.implements;
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
    private readonly IPasswordHash _passwordHash;


    public ServiceEmail(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IConfiguration config,
        IHttpContextAccessor httpContextAccessor, IServiceMaster serviceMaster, IPasswordHash passwordHash )
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _config = config;
        _httpContextAccessor = httpContextAccessor;
        _serviceMaster = serviceMaster;
        _passwordHash = passwordHash;
    }

    public async Task SendEmailForgotPassword(string email)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null) throw new GiangVienBadRequestException($"Không tìm thấy tài khoản có email là {email}");
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
        if (string.IsNullOrWhiteSpace(text))
        {
            _loggerService.LogError("Nội dung email template null hoặc rỗng");
            throw new ArgumentException("Nội dung email template không thể null hoặc rỗng", nameof(text));
        }

        if (placeHolder is not null)
        {
            foreach (var item in placeHolder)
            {
                if (text.Contains(item.Key))
                    text = text.Replace(item.Key, item.Value);
            }
        }

        return text;
    }

    private string GetEmailTemplate(string nameTemplate)
    {
        try
        {
            var filePath = string.Format(templatePath, nameTemplate);

            if (!File.Exists(filePath))
            {
                _loggerService.LogError($"Không tìm thấy file template: {filePath}");
                throw new FileNotFoundException($"Không tìm thấy template email: {filePath}");
            }

            var template = File.ReadAllText(filePath);

            if (string.IsNullOrWhiteSpace(template))
            {
                _loggerService.LogError($"File template rỗng: {filePath}");
                throw new InvalidOperationException($"Template email rỗng: {filePath}");
            }

            return template;
        }
        catch (Exception ex)
        {
            _loggerService.LogError($"Lỗi khi đọc email template '{nameTemplate}': {ex.Message}");
            throw;
        }
    }
    private string GenerateOTP_Mobile()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString(); // OTP 6 chữ số
    }

    public async Task SendOTPForgotPassword_Mobile(string email)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null)
            throw new GiangVienBadRequestException($"Không tìm thấy tài khoản có email là {email}");

        taiKhoan.OtpCode = GenerateOTP_Mobile();
        taiKhoan.OtpExpires = DateTime.Now.AddMinutes(5); // OTP hết hạn sau 5 phút

        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });

        _loggerService.LogInfo("Tạo OTP thành công!");

        try
        {
            var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByEmailAsync(email, false);
            var temp = string.Empty;
            if (giangVien is not null)
                temp = giangVien.HoTen;
            else
                temp = taiKhoan.Email;

            var responseEmail = new ResponseEmailDto
            {
                Recipient = taiKhoan.Email,
                Attachments = new List<KeyValuePair<string, string>>
            {
                new("{{OTP}}", taiKhoan.OtpCode),
                new("{{Name}}", temp!),
                new("{{ExpiryTime}}", "5 phút")
            }
            };

            await SendEmailAsyncWithTemplate("Mã OTP khôi phục mật khẩu", responseEmail, "OTPTemplate");
        }
        catch (Exception ex)
        {
            _loggerService.LogError("Xảy ra lỗi khi gửi OTP email!");
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> VerifyOTP_Mobile(string email, string otpCode)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null)
            return false;

        // Kiểm tra OTP có hợp lệ không
        if (string.IsNullOrEmpty(taiKhoan.OtpCode) ||
            taiKhoan.OtpCode != otpCode ||
            taiKhoan.OtpExpires is null ||
            DateTime.Now > taiKhoan.OtpExpires)
        {
            return false;
        }

        return true;
    }

    public async Task ResetPasswordWithOTP_Mobile(string email, string otpCode, string newPassword)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null)
            throw new GiangVienBadRequestException($"Không tìm thấy tài khoản có email là {email}");

        if (!await VerifyOTP_Mobile(email, otpCode))
        {
            throw new GiangVienBadRequestException("OTP không hợp lệ hoặc đã hết hạn");
        }

        taiKhoan.Password = _passwordHash.Hash(newPassword);
        taiKhoan.OtpCode = null; 
        taiKhoan.OtpExpires = null;

        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });

        _loggerService.LogInfo("Reset password bằng OTP thành công!");
    }

 
}