using System;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;

public class ResponseDanhSachDiemSoByLopDto
{
    public Guid Id { get; set; }
    public decimal? DiemChuyenCan { get; set; }
    public decimal? DiemTrungBinh { get; set; }
    public decimal? DiemThi1 { get; set; }
    public decimal? DiemThi2 { get; set; }
    public decimal? DiemTongKet1 { get; set; }
    public decimal? DiemTongKet2 { get; set; }
    public DateTime? NgayLuuDiem { get; set; }
    public DateTime? NgayNopDiem { get; set; }
    public int HocKy { get; set; }
    public string? GhiChu { get; set; }
    public int? TrangThai { get; set; }
    public Guid? SinhVienId { get; set; }
    public Guid? MonHocId { get; set; }
    public Guid? GiangVienId { get; set; }
    public Guid? LopHocPhanId { get; set; }
    public string TenLopHocPhan { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public int MSSV { get; set; }
    public string TenLopHoc { get; set; } = string.Empty;
}
