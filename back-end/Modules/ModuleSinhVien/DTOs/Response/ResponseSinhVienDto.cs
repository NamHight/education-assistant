using System;
using System.ComponentModel.DataAnnotations;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;

namespace Education_assistant.Modules.ModuleSinhVien.DTOs.Response;

public class ResponseSinhVienDto
{
    public Guid Id { get; set; }
    public string MSSV { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public DateTime? NgaySinh { get; set; }
    public int? GioiTinh { get; set; }
    public string DiaChi { get; set; } = string.Empty;
    public int? TrangThaiSinhVien { get; set; }
    public int? TinhTrangHocTap { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public DateTime NgayNhapHoc { get; set; }
    public Guid? LopHocId { get; set; }
    public LopHocSimpleDto? LopHoc { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public class SinhVienSimpleDto
{
    public Guid Id { get; set; }
    public string MSSV { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public DateTime? NgaySinh { get; set; }
}

public class ResponseSinhVienSummaryDto
{
    public int TongSoSinhVien { get; set; }
    public int SoXuatSac { get; set; }
    public int SoGioi { get; set; }
    public int SoKha { get; set; }
    public int SoCanCaiThien { get; set; }
    public int SoDangHoc { get; set; }
    public int SoDaTotNghiep { get; set; }
    public int SoTamNghi { get; set; }
}
public class ResponseSinhVienTinhTrangHocTapDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string MSSV { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public DateTime? NgaySinh { get; set; }
    public int? GioiTinh { get; set; }
    public string DiaChi { get; set; } = string.Empty;
    public int? TrangThaiSinhVien { get; set; }
    public int? TinhTrangHocTap { get; set; }
    public decimal GPA { get; set; }
    public int DiemDanh { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public DateTime NgayNhapHoc { get; set; }
    public Guid? LopHocId { get; set; }
    public LopHocSimpleDto? LopHoc { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
public class ResponseExportFileSinhVienDto
{
    public int STT { get; set; }
    public string MSSV { get; set; } = string.Empty;
    public string CCCD { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public DateTime? NgaySinh { get; set; }
    public string GioiTinh { get; set; } = string.Empty;
    public string DiaChi { get; set; } = string.Empty;
    public DateTime? NgayNhapHoc { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public string TenLop { get; set; } = string.Empty;
}

public class ResponseSinhVienDangKyMonHocDto
{
    public Guid Id { get; set; }
    public DateTime? NgayDangKyHoc { get; set; }
    public string? GhiChu { get; set; }
    public int? TrangThai { get; set; }
    public Guid? SinhVienId { get; set; }
    public Guid? LopHocPhanId { get; set; }
    public DateTime? CreatedAt { get; set; }
}