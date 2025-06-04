using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleSinhVien.DTOs.Response;

public class ResponseSinhVienDto
{
    public Guid Id { get; set; }
    public int MSSV { get; set; }
    public string CCCD { get; set; } = string.Empty;
    public string? AnhDaiDien { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public DateTime? NgaySinh { get; set; }
    public int? GioiTinhEnum { get; set; }
    public string DiaChi { get; set; } = string.Empty;
    public int? TrangThaiSinhVienEnum { get; set; }
    public int? TinhTrangHocTapSinhVienEnum { get; set; }
    public DateTime? NgayTotNghiep { get; set; }
    public DateTime NgayNhapHoc { get; set; }
    public Guid? LopHocId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
