using System;

namespace Education_assistant.Modules.ModuleGiangVien.DTOs.Response;

public class ResponseGiangVienDto
{
    public Guid Id { get; set; }
    public string? HoTen { get; set; }
    public string Email { get; set; } = string.Empty;
    public int? ChucVuGiangVienEnum { get; set; }
    public int? GioiTinhEnum { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? CCCD { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public DateTime? NgayVaoTruong { get; set; }
    public string? TrinhDo { get; set; }
    public string? ChuyenNganh { get; set; }
    public string? AnhDaiDien { get; set; }
    public int? TrangThaiGiangVienEnum { get; set; }
    public Guid? TaiKhoanId { get; set; }
    public Guid? KhoaId { get; set; }
    public Guid? BoMonId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
