using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleTruong.DTOs.Request;

public class RequestAddTruongDto
{
    [Required(ErrorMessage = "Mã trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã trường không được quá 255 ký tự")]
    public string MaTruong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên trường không được quá 255 ký tự")]
    public string TenTruong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;


    [Required(ErrorMessage = "Vị trí không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí không được quá 255 ký tự")]
    public string ViTri { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; } = string.Empty;

    [Required(ErrorMessage = "Website không được để trống")]
    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; } = string.Empty;
}
public class RequestUpdateTruongDto
{
    [Required(ErrorMessage = "Mã trường không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Mã trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã trường không được quá 255 ký tự")]
    public string MaTruong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên trường không được quá 255 ký tự")]
    public string TenTruong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;


    [Required(ErrorMessage = "Vị trí không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí không được quá 255 ký tự")]
    public string ViTri { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; } = string.Empty;

    [Required(ErrorMessage = "Website không được để trống")]
    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; } = string.Empty;
}
