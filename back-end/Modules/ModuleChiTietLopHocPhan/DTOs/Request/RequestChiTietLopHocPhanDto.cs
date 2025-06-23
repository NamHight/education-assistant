using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;

public class RequestAddChiTietLopHocPhanDto
{
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
    [Required(ErrorMessage ="Id sinh viên không được bỏ trống")]
    public Guid? SinhVienId { get; set; }
    [Required(ErrorMessage ="Id môn học không được bỏ trống")]
    public Guid? MonHocId { get; set; }
    [Required(ErrorMessage ="Id giảng viên không được bỏ trống")]
    public Guid? GiangVienId { get; set; }
    [Required(ErrorMessage ="Id lớp học phần không được bỏ trống")]
    public Guid? LopHocPhanId { get; set; }
}

public class RequestUpdateChiTietLopHocPhanDto
{
    [Required(ErrorMessage = "Id không được bỏ trống")]
    public Guid Id { get; set; }
    public decimal? DiemChuyenCan { get; set; }
    public decimal? DiemTrungBinh { get; set; }
    public decimal? DiemThi1 { get; set; }
    public decimal? DiemThi2 { get; set; }
    public decimal? DiemTongKet1 { get; set; }
    public decimal? DiemTongKet2 { get; set; }
    public DateTime? NgayLuuDiem { get; set; } = DateTime.Now;
    public DateTime? NgayNopDiem { get; set; }
    public int HocKy { get; set; }
    public string? GhiChu { get; set; }
    public int TrangThai { get; set; }
    [Required(ErrorMessage = "Id sinh viên không được bỏ trống")]
    public Guid SinhVienId { get; set; }
    [Required(ErrorMessage = "Id môn học không được bỏ trống")]
    public Guid MonHocId { get; set; }
    [Required(ErrorMessage = "Id giảng viên không được bỏ trống")]
    public Guid GiangVienId { get; set; }
    [Required(ErrorMessage = "Id lớp học phần không được bỏ trống")]
    public Guid LopHocPhanId { get; set; }
    public DateTime? CreatedAt { get; set; }
}
public class RequestNopDiemChiTietLopHocPhanDto
{
    public decimal DiemTongKet1 { get; set; }
    public decimal DiemTongKet2 { get; set; } = 0;
    public Guid? SinhVienId { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class RequestDeleteChiTietLopHocPhanDto
{
    [Required(ErrorMessage = "Danh sách id không được bỏ trống")]
    public List<Guid>? Ids { get; set; }
}
public class RequestImportFileDiemSoDto
{
    [Required(ErrorMessage = "Id lớp học phần được bỏ trống")]
    public Guid LopHocPhanId { get; set; }
    [Required(ErrorMessage = "File không được bỏ trống")]
    public IFormFile? File { get; set; }
}
public class ImportDiemSoDto
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
    public int? HocKy { get; set; }
    public string? GhiChu { get; set; } = string.Empty;
}