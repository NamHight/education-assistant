using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("diem_so")]
public class DiemSo : BaseEntity
{
    [Column("diem_chuyen_can")] public decimal DiemChuyenCan { get; set; }
    [Column("diem_trung_binh")] public decimal DiemTrungBinh { get; set; }
    [Column("diem_thi")] public decimal DiemThi { get; set; }
    [Column("diem_tong_ket")] public decimal DiemTongKet { get; set; }
    [Column("ngay_them")] public DateTime NgayThem { get; set; }
    [Column("ghi_chu")]
    public string GhiChu { get; set; }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("hoc_ky_id")] public Guid? HocKyId { get; set; }
    [ForeignKey("HocKyId")] public virtual HocKy? HocKy { get; set; }
    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }
    [ForeignKey("GiangVienId")] public virtual GiangVien? GiangVien { get; set; }


}