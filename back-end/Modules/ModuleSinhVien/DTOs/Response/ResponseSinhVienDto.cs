using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;

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
    public int MSSV { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public DateTime? NgaySinh { get; set; }
}