using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;

public class RequestAddTaiKhoanDto
{

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MaxLength(255, ErrorMessage = "Mật khẩu không được quá 255 ký tự")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
    public string LoaiTKhoan { get; set; } = string.Empty;
}
public class RequestUpdateTaiKhoanDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MaxLength(255, ErrorMessage = "Mật khẩu không được quá 255 ký tự")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
    public string LoaiTKhoan { get; set; } = string.Empty;
}