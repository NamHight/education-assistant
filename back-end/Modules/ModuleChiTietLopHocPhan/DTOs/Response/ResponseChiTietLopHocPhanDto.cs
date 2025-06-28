using System;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;

public class ResponseChiTietLopHocPhanDto
{
    public Guid? Id { get; set; }
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
    public SinhVienSimpleDto? SinhVien { get; set; }
    public Guid? MonHocId { get; set; }
    public MonHocSimpleDto? MonHoc { get; set; }
    public Guid? GiangVienId { get; set; }
    public GiangVienSimpleDto? GiangVien { get; set; }
    public Guid? LopHocPhanId { get; set; }
    public LopHocPhanSimpleDto? LopHocPhan { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ResponseExportFileDiemSoDto
{ 
    public int STT { get; set; }
    public int MaSinhVien { get; set; }
    public string HoTenSinhVien { get; set; } = string.Empty;
    public string TenMonHoc { get; set; } = string.Empty;
    public string HoTenGiangVien { get; set; } = string.Empty;
    public decimal? DiemChuyenCan { get; set; }
    public decimal? DiemTrungBinh { get; set; }
    public decimal? DiemThi1 { get; set; }
    public decimal? DiemThi2 { get; set; }
    public decimal? DiemTongKet1 { get; set; }
    public decimal? DiemTongKet2 { get; set; }
    public int HocKy { get; set; }
    public string GhiChu { get; set; } = string.Empty;
}