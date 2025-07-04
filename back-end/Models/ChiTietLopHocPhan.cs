using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Models;

[Table("chi_tiet_lop_hoc_phan")]
public class ChiTietLopHocPhan : BaseEntity
{
    [Column("diem_chuyen_can")] [Precision(4,2)] public decimal? DiemChuyenCan { get; set; }
    [Column("diem_trung_binh")] [Precision(4,2)] public decimal? DiemTrungBinh { get; set; }
    [Column("diem_thi_1")] [Precision(4,2)] public decimal? DiemThi1 { get; set; }
    [Column("diem_thi_2")] [Precision(4,2)] public decimal? DiemThi2 { get; set; }
    [Column("diem_tong_ket_1")] [Precision(4,2)] public decimal? DiemTongKet1 { get; set; }
    [Column("diem_tong_ket_2")] [Precision(4,2)] public decimal? DiemTongKet2 { get; set; }
    [Column("ngay_luu_diem")] public DateTime? NgayLuuDiem { get; set; }
    [Column("ngay_nop_diem")] public DateTime? NgayNopDiem { get; set; }
    [Column("hoc_ky")] public int HocKy { get; set; }
    [Column("ghi_chu")]
    public string? GhiChu { get; set; }
    [Column("trang_thai_diem")]
    [Range(1, 2, ErrorMessage = "Trạng thái không hợp lệ")]
    public int? TrangThai { get; set; }

    [NotMapped]
    public TrangThaiChiTietLopHocPhanEnum? TrangThaiChiTietLopHocPhanEnum
    {
        get => TrangThai.HasValue ? (TrangThaiChiTietLopHocPhanEnum)TrangThai.Value : null;
        set => TrangThai = value.HasValue ? (int)value.Value : null;
    }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }
    [ForeignKey("GiangVienId")] public virtual GiangVien? GiangVien { get; set; }
    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }
}