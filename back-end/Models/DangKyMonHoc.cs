using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Models;
[Table("dang_ky_mon_hoc")]
public class DangKyMonHoc : BaseEntity
{
    [Column("ngay_dang_ky_hoc")] [Required] public DateTime NgayDangKyHoc { get; set; }
    [Column("diem")] [Precision(2,2)] public decimal? Diem { get; set; }
    [Column("ghi_chu")] public string? GhiChu { get; set; }

    [Column("trang_thai")]
    [Range(1, 4, ErrorMessage = "Trạng thái không hợp lệ")]
    public int? TrangThai { get; set; }

    [NotMapped]
    public TrangThaiDangKyMonHocEnum? TrangThaiDangKyMonHocEnum
    { 
        get => TrangThai.HasValue ? (TrangThaiDangKyMonHocEnum)TrangThai.Value : null; 
        set => TrangThai = value.HasValue ? (int)value.Value : null;
    }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }
    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }
}