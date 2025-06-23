using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleBoMon.DTOs.Request;

public class RequestAddBoMonDto
{
    [Required(ErrorMessage = "Tên bộ môn không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên bộ môn không được quá 255 ký tự")]
    public string TenBoMon { get; set; } = string.Empty;
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(15)]
    public string SoDienThoai { get; set; } = string.Empty;
    [Required(ErrorMessage = "Id khoa không được để trống")]
    public Guid? KhoaId { get; set; }
}
public class RequestUpdateBoMonDto
{
    [Required(ErrorMessage = "Id bộ môn không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Tên bộ môn không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên bộ môn không được quá 255 ký tự")]
    public string TenBoMon { get; set; } = string.Empty;
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(15)]
    public string SoDienThoai { get; set; } = string.Empty;
    [Required(ErrorMessage = "Id khoa không được để trống")]
    public Guid? KhoaId { get; set; }
    public DateTime? CreatedAt { get; set; }
}
