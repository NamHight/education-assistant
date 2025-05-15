using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("mon_hoc")]
public class MonHoc : BaseEntity
{
    [Column("ma_mon_hoc")]
    [Required(ErrorMessage = "Mã môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string MaMonHoc { get; set; }

    [Column("ten_mon_hoc")]
    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; }

    [Column("so_tin_chi")]
    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }

    [Column("mo_ta")]
    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; }

    [Column("so_tiet")]
    [Required(ErrorMessage = "Số tiết không được để trống")]
    public int SoTiet { get; set; }

    [Column("loai")]
    [Range(1, 2, ErrorMessage = "Loại môn học không hợp lệ")]
    public int? LoaiMonHoc { get; set; }

    [NotMapped]
    public LoaiMonHocEnum? LoaiMonHocEnum 
    { 
        get => LoaiMonHoc.HasValue ? (LoaiMonHocEnum)LoaiMonHoc.Value : null;
        set => LoaiMonHoc = value.HasValue ? (int)value.Value: null;
    }

    [Column("khoa_id")] public Guid? KhoaId {get; set;}

    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }

    public virtual ICollection<DiemSo>? DanhSachDiemSo { get; set; }
    public virtual ICollection<MonHocDaoTao>? DanhSachMonHocDaoTao { get; set; }
    public virtual ICollection<LopHocPhan>? DanhSachLopHocPhan { get; set; }
    public virtual ICollection<DiemTong>? DanhSachDiemTong { get; set; }
}