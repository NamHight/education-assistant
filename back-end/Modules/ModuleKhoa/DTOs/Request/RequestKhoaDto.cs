using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleKhoa.DTOs.Request;

public class RequestAddKhoaDto
{
    [Required(ErrorMessage = "Tên khoa không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên khoa không được quá 255 ký tự")]
    public string TenKhoa { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vị trí phòng không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí phòng không được quá 255 ký tự")]
    public string ViTriPhong { get; set; } = string.Empty;

    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; } = string.Empty;
}

public class RequestUpdateKhoaDto
{
    [Required(ErrorMessage = "Id khoa không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Tên khoa không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên khoa không được quá 255 ký tự")]
    public string TenKhoa { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vị trí phòng không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí phòng không được quá 255 ký tự")]
    public string ViTriPhong { get; set; } = string.Empty;

    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
}