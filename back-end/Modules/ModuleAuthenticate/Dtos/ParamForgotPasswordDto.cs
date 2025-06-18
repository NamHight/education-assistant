using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleAuthenticate.Dtos;

public class ParamForgotPasswordDto
{
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Email không được để trống")]
    public string Token { get; set; } = string.Empty;
}
