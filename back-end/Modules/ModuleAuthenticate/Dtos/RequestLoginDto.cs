using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleAuthenticate.Dtos;

public class RequestLoginDto
{
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;


    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [DataType(DataType.Password, ErrorMessage = "Mật khẩu không hợp lệ")]
    public string Password { get; set; } = string.Empty;
}