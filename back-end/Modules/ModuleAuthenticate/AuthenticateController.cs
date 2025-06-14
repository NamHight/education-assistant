using Education_assistant.Modules.ModuleAuthenticate.Dtos;
using Education_assistant.Services.ServiceMaster;
using FashionShop_API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleAuthenticate;

[Route("api/[controller]")]
[ApiController]
public class AuthenticateController : ControllerBase
{
    private readonly IServiceMaster _serviceMaster;

    public AuthenticateController(IServiceMaster serviceMaster)
    {
        _serviceMaster = serviceMaster;
    }

    [HttpPost("login")]
    [ServiceFilter(typeof(ValidationFilter))]
    public async Task<IActionResult> Login([FromBody] RequestLoginDto loginDto)
    {
        var result = await _serviceMaster.Authenticate.Login(loginDto);
        _serviceMaster.Authenticate.SetTokenCookie(result.accessToken, result.refreshToken, HttpContext);
        return Ok(new LoginResponseDto(result.giangVienDto, result.accessToken, result.refreshToken));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var accessToken = HttpContext.Request.Cookies["access_token"];
        var refreshToken = HttpContext.Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { message = "Invalid tokens." });
        var result = await _serviceMaster.Authenticate.refresh(accessToken, refreshToken);
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
}