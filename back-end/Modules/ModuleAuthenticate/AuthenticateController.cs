using Education_assistant.Modules.ModuleAuthenticate.Dtos;
using Education_assistant.Services.ServiceEmails;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleAuthenticate;

[Route("api/[controller]")]
[ApiController]
public class AuthenticateController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IServiceEmail _serviceEmail;
    private readonly IServiceMaster _serviceMaster;

    public AuthenticateController(IServiceMaster serviceMaster, IServiceEmail serviceEmail, IConfiguration config)
    {
        _serviceMaster = serviceMaster;
        _serviceEmail = serviceEmail;
        _config = config;
    }

    [HttpPost("login")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<IActionResult> Login([FromForm] RequestLoginDto loginDto)
    {
        var result = await _serviceMaster.Authenticate.Login(loginDto);
        _serviceMaster.Authenticate.SetTokenCookie(result.accessToken, result.refreshToken, HttpContext);
        return Ok(new LoginResponseDto(result.giangVienDto, result.accessToken, result.refreshToken));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RequestRefreshTokenDto requestRefreshTokenDto)
    {
        if (string.IsNullOrEmpty(requestRefreshTokenDto.refreshToken))
            return Unauthorized(new { message = "Invalid tokens." });
        var result = await _serviceMaster.Authenticate.refresh(requestRefreshTokenDto.refreshToken);
        Console.WriteLine($"9999999999 accessToken {result.accessToken}");
        _serviceMaster.Authenticate.SetTokenCookie(result.accessToken, result.refreshToken, HttpContext);
        return Ok(new ResponseRefreshToken(result.accessToken, result.refreshToken));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string email)
    {
        HttpContext.Response.Cookies.Delete("access_token");
        HttpContext.Response.Cookies.Delete("refresh_token");
        await _serviceMaster.Authenticate.Logout(email, HttpContext);
        return Ok(new { message = "Logged out successfully." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] string email)
    {
        Console.WriteLine("Email nhận được: " + email);
        if (email is null) return BadRequest("Email không được bỏ trống!");
        await _serviceEmail.SendEmailForgotPassword(email);
        return Ok(
            new
            {
                message = "Vui lòng kiểm tra email để đặt lại mật khẩu.", email
            });
    }

    [HttpGet("forgot-password-confirm")]
    public async Task<IActionResult> ForgotPasswordConfirm([FromQuery] ParamForgotPasswordDto request)
    {
        var baseUrl = _config["AppSettings:ClientBaseUrl"];
        var result = await _serviceMaster.Authenticate.ForgotPasswordConfirm(request);
        if (result) return Redirect($"{baseUrl}/quen-mat-khau/thay-doi?email={request.Email}&token={request.Token}");
        return Redirect($"{baseUrl}/quen-mat-khau/that-bai?email={request.Email}&token={request.Token}");
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromForm] RequestForgotPasswordDto request)
    {
        await _serviceMaster.Authenticate.ResetPassword(request);
        return Ok("Thay đổi mật thành công");
    }

    [Authorize(Policy = "GiangVien")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMeAsync()
    {
        var result = await _serviceMaster.Authenticate.GetMeAsync();
        return Ok(result);
    }

    [HttpPost("send-otp-forgot-password")]
    public async Task<IActionResult> SendOTPForgotPassword([FromBody] SendOTPRequestMobileDto request)
    {
        try
        {
            await _serviceEmail.SendOTPForgotPassword_Mobile(request.Email);
            return Ok(new { message = "OTP đã được gửi đến email của bạn" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOTP([FromBody] VerifyOTPRequestMobileDto request)
    {
        try
        {
            var isValid = await _serviceEmail.VerifyOTP_Mobile(request.Email, request.OtpCode);
            if (isValid)
            {
                return Ok(new { message = "OTP hợp lệ" });
            }
            return BadRequest(new { message = "OTP không hợp lệ hoặc đã hết hạn" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password-with-otp")]
    public async Task<IActionResult> ResetPasswordWithOTP([FromBody] ResetPasswordOTPRequestMobileDto request)
    {
        try
        {
            await _serviceEmail.ResetPasswordWithOTP_Mobile(request.Email, request.OtpCode, request.NewPassword);
            return Ok(new { message = "Đổi mật khẩu thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}