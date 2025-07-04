using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;

namespace Education_assistant.Modules.ModuleGiangVien.DTOs.Response;

public class ResponseGiangVienDto
{
    public Guid Id { get; set; }
    public string? HoTen { get; set; }
    public string Email { get; set; } = string.Empty;
    public int? ChucVu { get; set; }
    public int? GioiTinh { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? CCCD { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public DateTime? NgayVaoTruong { get; set; }
    public string? TrinhDo { get; set; }
    public string? ChuyenNganh { get; set; }
    public string? AnhDaiDien { get; set; }
    public int? TrangThai { get; set; }
    public KhoaSimpleDto? Khoa { get; set; }
    public Guid? BoMonId { get; set; }
    public Guid? KhoaId { get; set; }
    public Guid? TaiKhoanId { get; set; }
    public BoMonSimpleDto? BoMon { get; set; }
    public TaiKhoanSimpleDto? TaiKhoan { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public class GiangVienSimpleDto
{
    public Guid Id { get; set; }
    public string? HoTen { get; set; }
}

public class TaiKhoanSimpleDto
{
    public int LoaiTaiKhoan { get; set; }
}
public class GiangVienSummaryDto
{
    public Guid Id { get; set; }
    public string? HoTen { get; set; }
    public string Email { get; set; } = string.Empty;
    public int? ChucVu { get; set; }
    public int? GioiTinh { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? CCCD { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public DateTime? NgayVaoTruong { get; set; }
    public string? TrinhDo { get; set; }
    public string? ChuyenNganh { get; set; }
    public string? AnhDaiDien { get; set; }
    public int? TrangThai { get; set; }
    public Guid? BoMonId { get; set; }
    public Guid? KhoaId { get; set; }
    public Guid? TaiKhoanId { get; set; }
    public BoMonSimpleDto? BoMon { get; set; }
}

public class ResponseGiangVienSummaryDto
{
    public int TongSoGiangVien { get; set; }
    public int DangCongTac { get; set; }
    public int NghiViec { get; set; }
    public int NghiHuu { get; set; }
    public int ChucVuGiangVien { get; set; }
    public int ChucVuGiangVienChinh { get; set; }
    public int ChucVuTruongBoMon { get; set; }
    public int ChucVuTruongKhoa { get; set; }
}