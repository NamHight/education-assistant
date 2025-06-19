using Education_assistant.Models;
using Education_assistant.Modules.ModuleAuthenticate.Dtos;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;

namespace Education_assistant.Modules.ModuleAuthenticate.Services;

public interface IServiceAuthenticate
{
    Task<(ResponseGiangVienDto giangVienDto, string accessToken, string refreshToken)> Login(
        RequestLoginDto requestLoginDto);

    void SetTokenCookie(string accessToken, string refreshToken, HttpContext httpContext);
    Task<(string accessToken, string refreshToken)> refresh(string accessToken, string refreshToken);

    Task Logout(string email, HttpContext httpContext);
    Task ForgotPasswordConfirm(ParamForgotPasswordDto request);
    Task ResetPassword(RequestForgotPasswordDto request);
    string GenerateToken(TaiKhoan taiKhoan);
    Task<ResponseGiangVienDto> GetMeAsync();
}