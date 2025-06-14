using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleGiangVien.DTOs.Request;

public class RequestAddGiangVienDto
{
    [Required(ErrorMessage = "Họ và tên không được bỏ trống!.")]
    [MaxLength(255)]
    public string? HoTen { get; set; }

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chức vụ không được để trống")]
    public int? ChucVu { get; set; }
    [Required(ErrorMessage = "Giới tính không được để trống")]
    public int? GioiTinh { get; set; }

    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    [Required(ErrorMessage = "CCCD không được để trống")]
    [MaxLength(255)]
    public string? CCCD { get; set; } = string.Empty;

    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public DateTime? NgayVaoTruong { get; set; }
    public string? TrinhDo { get; set; }
    [MaxLength(255)]
    public string? ChuyenNganh { get; set; }
    public int? TrangThai { get; set; }
    public int? LoaiTaiKhoan { get; set; } = 3;
    public Guid? KhoaId { get; set; }
    public Guid? BoMonId { get; set; }

    public IFormFile? File { get; set; }
}
public class RequestUpdateGiangVienDto
{
    [Required(ErrorMessage = "Id không được bỏ trống!.")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Họ và tên không được bỏ trống!.")]
    [MaxLength(255)]
    public string? HoTen { get; set; }

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chức vụ không được để trống")]
    public int? ChucVu { get; set; }
    [Required(ErrorMessage = "Giới tính không được để trống")]
    public int? GioiTinh { get; set; }

    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    [Required(ErrorMessage = "CCCD không được để trống")]
    [MaxLength(255)]
    public string? CCCD { get; set; } = string.Empty;

    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public DateTime? NgayVaoTruong { get; set; }
    public string? TrinhDo { get; set; }
    [MaxLength(255)]
    public string? ChuyenNganh { get; set; }
    public int? TrangThai { get; set; }
    public Guid? TaiKhoanId { get; set; }
    public Guid? KhoaId { get; set; }
    public Guid? BoMonId { get; set; }
    public IFormFile? File { get; set; }
}
