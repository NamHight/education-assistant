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

public class RequestImportFileSinhVienDto
{
    [Required(ErrorMessage = "Id lớp học được bỏ trống")]
    public Guid lopHocId { get; set; }
    [Required(ErrorMessage = "File không được bỏ trống")]
    public IFormFile? File { get; set; }
}
public class ImportFileSinhVienDto
{
    public int STT { get; set; }
    public string MSSV { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public DateTime? NgaySinh { get; set; }
    public string? GioiTinh { get; set; } = string.Empty;
    public string? DiaChi { get; set; } = string.Empty;
    public DateTime? NgayNhapHoc { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
}

public class RequestSinhVienDangKyMonHocDto
{
    [Required(ErrorMessage = "Id sinh viên không được bỏ trống")]
    public Guid SinhVienId { get; set; }
    [Required(ErrorMessage = "Id lớp học phần không được bỏ trống")]
    public Guid LopHocPhanId { get; set; }
}