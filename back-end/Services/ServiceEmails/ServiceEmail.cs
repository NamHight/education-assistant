using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceEmails.DTOs.Request;
using Education_assistant.Services.ServiceEmails.DTOs.Response;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using NuGet.Common;

namespace Education_assistant.Services.ServiceEmails;

public class ServiceEmail : IServiceEmail
{
    private const string templatePath = @"Templates/{0}.html";
    private readonly IRepositoryMaster _repositoryMaster;
    private readonly ILoggerService _loggerService;
    private readonly IConfiguration _config;
    public ServiceEmail(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IConfiguration config)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _config = config;
    }

    public async Task<RequestEmailTokenDto?> HandleSendEmail(string email)
    {
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByEmailAsync(email, false);
        if (giangVien is null)
        {
            throw new GiangVienBadRequestException("Email không được để trống!.");
        }
        var token = generateTokenEmail(giangVien.Id, DateTime.Now.AddMinutes(5));
        var result = new RequestEmailTokenDto(giangVien, token);
        return result;
    }

    public async Task SendEmailComfirmAsync(RequestEmailTokenDto model, string url, string template)
    {
        var responseEmail = new ResponseEmailDto
        {
            Recipient = model.GiangVien.Email,
            Attachments = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("{{Link}}", url),
                new KeyValuePair<string, string>("{{Name}}", model.GiangVien.HoTen!)
            }
        };
        await SendEmailAsyncWithTemplate("Cập nhật mật khẩu", responseEmail, template);
    }

    private async Task SendEmailAsyncWithTemplate(string title,ResponseEmailDto model,string template)
    {
        model.Subject = title;
        model.Body = UpdatePlaceHolder(GetEmailTemplate(template), model.Attachments);
        await SendMailAsync(model);
    }

    private async Task SendMailAsync(ResponseEmailDto model) {
        _loggerService.LogInfo("Gửi email giảng viên thành công.");
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["EmailSetting:From"]));
        email.To.Add(MailboxAddress.Parse(model.Recipient));
        email.Subject = model.Subject;

        var builder = new BodyBuilder { HtmlBody = model.Body };
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_config["EmailSetting:SmtpServer"], int.Parse(_config["EmailSetting:Port"]!), SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_config["EmailSetting:Username"], _config["EmailSetting:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    private string UpdatePlaceHolder(string text, List<KeyValuePair<string, string>>? placeHolder)
    {
        if (!string.IsNullOrWhiteSpace(text) && placeHolder is not null)
        {
            foreach (var item in placeHolder)
            {
                if (text.Contains(item.Key))
                {
                    text = text.Replace(item.Key, item.Value);
                }
            }
        }
        return text;
    }

    private string generateTokenEmail(Guid giangVienId, DateTime expire)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = _config["Jwt:Key"];
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, giangVienId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, giangVienId.ToString())
        };

        var singingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
        var singingCredentials = new SigningCredentials(singingKey, SecurityAlgorithms.HmacSha256Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expire,
            Audience = audience,
            Issuer = issuer,
            SigningCredentials = singingCredentials
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);

    }
    private string GetEmailTemplate(string nameTemplate)
    {
        var template = File.ReadAllText(string.Format(templatePath, nameTemplate));
        return template;
    }

    public async Task<bool> ValidateTokenPasswordAsync(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = _config["Jwt:Key"];
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
        };
        var claims = await tokenHandler.ValidateTokenAsync(token, validationParameters);
        var nameIdentifier = claims.Claims[ClaimTypes.NameIdentifier].ToString();
        if (!string.IsNullOrWhiteSpace(nameIdentifier))
        {
            var giangVienId = Guid.Parse(nameIdentifier);
            var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByIdAsync(giangVienId, false);
            if (giangVien is null)
            {
                _loggerService.LogWarn("Giảng viên với id không tìm thấy!.");
                return false;
            }
            _loggerService.LogInfo("Giảng viên với id xác nhận thành công!");
            return true;

        }
        return false;
    }
}
