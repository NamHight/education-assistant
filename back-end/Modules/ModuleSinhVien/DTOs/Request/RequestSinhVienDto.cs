using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleSinhVien.DTOs.Request;

public class RequestAddSinhVienDto
{
    [Required(ErrorMessage = "Mã số sinh viên không được để trống")]
    public string MSSV { get; set; } = string.Empty;

    [Required(ErrorMessage = "Căn cước công dân không được để trống")]
    [MaxLength(255, ErrorMessage = "Căn cước công dân không được quá 255 ký tự")]
    public string CCCD { get; set; } = string.Empty;

    [Required(ErrorMessage = "Họ và tên không được để trống")]
    [MaxLength(255, ErrorMessage = "Họ và tên không được quá 255 ký tự")]
    public string HoTen { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }

    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    public int? GioiTinhEnum { get; set; }

    [Required(ErrorMessage = "Địa chỉ không được để trống")]
    [MaxLength(255, ErrorMessage = "Địa chỉ không được quá 255 ký tự")]
    public string DiaChi { get; set; } = string.Empty;
    [Required(ErrorMessage = "Trạng thái sinh viên không được để trống")]

    [Range(1, 5, ErrorMessage = "Giá trị trạng thái không hợp lệ")]
    public int? TrangThaiSinhVienEnum { get; set; }

    [Range(1, 6, ErrorMessage = "Giá trị tình trạng học tập không hợp lệ")]
    public int? TinhTrangHocTapSinhVienEnum { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public DateTime NgayNhapHoc { get; set; }
    public Guid? LopHocId { get; set; }
    public IFormFile? File { get; set; }
}
public class RequestUpdateSinhVienDto
{
    [Required(ErrorMessage = "Id sinh viên không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Mã số sinh viên không được để trống")]
    public string MSSV { get; set; } = string.Empty;

    [Required(ErrorMessage = "Căn cước công dân không được để trống")]
    [MaxLength(255, ErrorMessage = "Căn cước công dân không được quá 255 ký tự")]
    public string CCCD { get; set; } = string.Empty;

    [Required(ErrorMessage = "Họ và tên không được để trống")]
    [MaxLength(255, ErrorMessage = "Họ và tên không được quá 255 ký tự")]
    public string HoTen { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }

    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    public int? GioiTinhEnum { get; set; }

    [Required(ErrorMessage = "Địa chỉ không được để trống")]
    [MaxLength(255, ErrorMessage = "Địa chỉ không được quá 255 ký tự")]
    public string DiaChi { get; set; } = string.Empty;
    [Required(ErrorMessage = "Trạng thái sinh viên không được để trống")]

    [Range(1, 5, ErrorMessage = "Giá trị trạng thái không hợp lệ")]
    public int? TrangThaiSinhVienEnum { get; set; }

    [Range(1, 6, ErrorMessage = "Giá trị tình trạng học tập không hợp lệ")]
    public int? TinhTrangHocTapSinhVienEnum { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public DateTime NgayNhapHoc { get; set; }
    public Guid? LopHocId { get; set; }
    public IFormFile? File { get; set; }
    public DateTime? CreatedAt { get; set; }
}
