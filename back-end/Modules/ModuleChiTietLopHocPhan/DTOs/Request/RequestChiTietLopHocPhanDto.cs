using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;

public class RequestAddChiTietLopHocPhanDto
{
    [Required(ErrorMessage ="Điểm chuyên cần không được bỏ trống")]
    public decimal? DiemChuyenCan { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public decimal? DiemTrungBinh { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public decimal? DiemThi { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public decimal? DiemTongKet { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public DateTime? NgayLuuDiem { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public DateTime? NgayNopDiem { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public int HocKy { get; set; }
    public string? GhiChu { get; set; }
    public int? TrangThaiChiTietLopHocPhanEnum { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public Guid? SinhVienId { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public Guid? MonHocId { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public Guid? GiangVienId { get; set; }
    [Required(ErrorMessage ="Điểm trung binh không được bỏ trống")]
    public Guid? LopHocPhanId { get; set; }
}

public class RequestUpdateChiTietLopHocPhanDto
{
    public Guid? Id { get; set; }
    public decimal? DiemChuyenCan { get; set; }
    public decimal? DiemTrungBinh { get; set; }
    public decimal? DiemThi { get; set; }
    public decimal? DiemTongKet { get; set; }
    public DateTime? NgayLuuDiem { get; set; }
    public DateTime? NgayNopDiem { get; set; }
    public int HocKy { get; set; }
    public string? GhiChu { get; set; }
    public int? TrangThaiChiTietLopHocPhanEnum { get; set; }
    public Guid? SinhVienId { get; set; }
    public Guid? MonHocId { get; set; }
    public Guid? GiangVienId { get; set; }
    public Guid? LopHocPhanId { get; set; }
}