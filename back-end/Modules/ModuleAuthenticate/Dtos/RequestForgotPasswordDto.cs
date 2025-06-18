using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleAuthenticate.Dtos;

public class RequestForgotPasswordDto
{
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Email không được để trống")]
    public string Token { get; set; } = string.Empty;
    [DataType(DataType.Password)]
    [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*\d).+$", ErrorMessage = "Password must contain at least one letter and one number.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải lớn hơn 6 ký tự")]
    public string Password { get; set; } = string.Empty;
}
