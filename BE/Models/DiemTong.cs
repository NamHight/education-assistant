using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;
[Table("diem_tong")]
public class DiemTong : BaseEntity
{
    [Column("diem_tong_ket")] 
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; }

    [Column("mo_ta")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string MoTa { get; set; }

    [Column("loai")]
    [Range(1, 2, ErrorMessage = "Loại môn học không hợp lệ")]
    public int? LoaiMonHoc { get; set; }

    [NotMapped]
    public LoaiMonHocEnum? LoaiMonHocEnum 
    { 
        get => LoaiMonHoc.HasValue ? (LoaiMonHocEnum)LoaiMonHoc.Value : null;
        set => LoaiMonHoc = value.HasValue ? (int)value.Value: null;
    }

    [Column("tin_chi")]
    [Required(ErrorMessage = "Tín chỉ không được để trống")]
    public int TinChi { get; set; }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }

    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }

    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }

    [Column("hoc_ky_id")] public Guid? HocKyId { get; set; }
    [ForeignKey("HocKyId")] public virtual HocKy? HocKy {get; set;}
}