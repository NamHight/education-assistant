using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Exceptions.ThrowError.GiangVienExceptions;
using Education_assistant.Exceptions.ThrowError.TaiKhoanExceptions;
using Education_assistant.Extensions;
using Education_assistant.helpers.implements;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleAuthenticate.Dtos;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.RepositoryMaster;
using Microsoft.IdentityModel.Tokens;

namespace Education_assistant.Modules.ModuleAuthenticate.Services;

public class ServiceAuthenticate : IServiceAuthenticate
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoggerService _loggerService;
    private readonly IMapper _mapper;
    private readonly IPasswordHash _passwordHash;
    private readonly IRepositoryMaster _repositoryMaster;

    public ServiceAuthenticate(ILoggerService loggerService, IRepositoryMaster repositoryMaster, IMapper mapper,
        IConfiguration configuration, IPasswordHash passwordHash, IHttpContextAccessor httpContextAccessor)
    {
        _repositoryMaster = repositoryMaster;
        _loggerService = loggerService;
        _mapper = mapper;
        _configuration = configuration;
        _passwordHash = passwordHash;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<(ResponseGiangVienDto giangVienDto, string accessToken, string refreshToken)> Login(
        RequestLoginDto requestLoginDto)
    {
        var expiresInMinutes = _configuration.GetValue<int>("ExpiresInMinutes:RefreshToken");
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(requestLoginDto.Email, false);
        if (taiKhoan is null) throw new TaiKhoanEmailNotFoundException(requestLoginDto.Email);
        if (!_passwordHash.Verify(requestLoginDto.Password, taiKhoan.Password))
            throw new TaiKhoanBadRequestException("Mật khẩu không đúng!");
        var refreshToken = GenerateRefreshToken();
        Console.WriteLine($"8888888888888 refreshToken {refreshToken}");
        var accessToken = GenerateToken(taiKhoan);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            taiKhoan.ResetToken = refreshToken;
            taiKhoan.ResetTokenExpires = DateTime.UtcNow.AddMinutes(expiresInMinutes);
            taiKhoan.LastLoginDate = DateTime.UtcNow;
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByEmailAsync(taiKhoan.Email, false);
        if (giangVien is null) throw new GiangVienEmailNotFoundException(taiKhoan.Email);
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        _loggerService.LogInfo("Đăng nhập thành công.");
        return (giangVienDto, accessToken, refreshToken);
    }

    public void SetTokenCookie(string accessToken, string refreshToken, HttpContext httpContext)
    {
        httpContext.Response.Cookies.Append("access_token", accessToken, new CookieOptions
        {
            Expires = DateTimeOffset.Now.AddMinutes(30),
            IsEssential = true,
            Secure = true,
            HttpOnly = false,
            SameSite = SameSiteMode.None,
            Path = "/"
        });
        httpContext.Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
        {
            Expires = DateTimeOffset.Now.AddDays(7),
            IsEssential = true,
            Secure = true,
            HttpOnly = false,
            SameSite = SameSiteMode.None,
            Path = "/"
        });
    }

    public async Task<(string accessToken, string refreshToken)> refresh(string refreshToken)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByRefreshTokenAsync(refreshToken, false);
        if (taiKhoan is null || taiKhoan.ResetToken != refreshToken ||
            taiKhoan.ResetTokenExpires < DateTime.UtcNow)
            throw new TaiKhoanBadRequestException("Refresh token không hợp lệ hoặc đã hết hạn.");
        var newAccessToken = GenerateToken(taiKhoan);
        var returnRefreshToken = refreshToken;
        var timeUntilExpiry = taiKhoan.ResetTokenExpires - DateTime.UtcNow;
        if (timeUntilExpiry?.TotalDays < 7)
        {
            var newRefreshToken = GenerateRefreshToken();
            await _repositoryMaster.ExecuteInTransactionAsync(async () =>
            {
                taiKhoan.ResetToken = newRefreshToken;
                taiKhoan.ResetTokenExpires = DateTime.UtcNow.AddDays(30);
                _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            });
            returnRefreshToken = newRefreshToken;
        }

        return (newAccessToken, returnRefreshToken);
    }

    public async Task Logout(string email, HttpContext httpContext)
    {
        var taiKhoan = await _repositoryMaster.TaiKhoan.GetTaiKhoanByEmailAsync(email, false);
        if (taiKhoan is null) throw new TaiKhoanEmailNotFoundException(email);
        httpContext.Response.Cookies.Delete("access_token", new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });
        httpContext.Response.Cookies.Delete("refresh_token", new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            taiKhoan.ResetToken = null;
            taiKhoan.ResetTokenExpires = null;
            taiKhoan.LastLoginDate = null;
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
        });
    }

    public string GenerateToken(TaiKhoan taiKhoan)
    {
        var secretKey = _configuration.GetSection("Jwt:SecretKey").Value;
        var expiresInMinutes = _configuration.GetValue<int>("ExpiresInMinutes:AccessToken");
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Email, taiKhoan.Email),
                new Claim(ClaimTypes.NameIdentifier, taiKhoan.Id.ToString()),
                new Claim(ClaimTypes.Role, taiKhoan.LoaiTaiKhoan.ToString()!)
            }),
            Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task ForgotPasswordConfirm(ParamForgotPasswordDto request)
    {
        var taiKhoan =
            await _repositoryMaster.Authenticate.GetTaiKhoanByEmailAndTokenAsync(request.Email, request.Token, false);
        if (taiKhoan is null || taiKhoan.ResetPasswordExpires < DateTime.Now)
            throw new TaiKhoanBadRequestException(
                "Dữ liệu đầu vào không tìm thấy, thời gian very email đã hết 5 phút, gửi lại");
        _loggerService.LogInfo("Confirm mật khẩu quên thành công!");
    }

    public async Task ResetPassword(RequestForgotPasswordDto request)
    {
        var taiKhoan =
            await _repositoryMaster.Authenticate.GetTaiKhoanByEmailAndTokenAsync(request.Email, request.Token, false);
        if (taiKhoan is null || taiKhoan.ResetPasswordExpires < DateTime.Now)
            throw new TaiKhoanBadRequestException(
                "Dữ liệu đầu vào không tìm thấy, thời gian very email đã hết 5 phút, gửi lại");
        taiKhoan.ResetPassword = null;
        taiKhoan.ResetPasswordExpires = null;
        taiKhoan.Password = _passwordHash.Hash(request.Password);
        await _repositoryMaster.ExecuteInTransactionAsync(async () =>
        {
            _repositoryMaster.TaiKhoan.UpdateTaiKhoan(taiKhoan);
            await Task.CompletedTask;
        });
        _loggerService.LogInfo("Cập nhật mật khẩu quên thành công!");
    }

    public async Task<ResponseGiangVienDto> GetMeAsync()
    {
        var taiKhoanId = _httpContextAccessor.HttpContext!.User.GetUserId();
        if (taiKhoanId == Guid.Empty) throw new TaiKhoanBadRequestException("Thông tin tài khoản id không đầy đủ");
        var giangVien = await _repositoryMaster.GiangVien.GetGiangVienByTaiKhoanIdAsync(taiKhoanId, false);
        if (giangVien is null) throw new TaiKhoanNotFoundException(taiKhoanId);
        var giangVienDto = _mapper.Map<ResponseGiangVienDto>(giangVien);
        return giangVienDto;
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}