using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("mon_hoc")]
public class MonHoc : BaseEntity
{
    [Column("ma_mon_hoc")]
    [Required(ErrorMessage = "Mã môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string MaMonHoc { get; set; } = string.Empty;

    [Column("ten_mon_hoc")]
    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; } = string.Empty;

    [Column("mo_ta")]
    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; } = string.Empty;
    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }
    public virtual ICollection<LopHocPhan>? DanhSachLopHocPhan { get; set; }
    public virtual ICollection<ChiTietChuongTrinhDaoTao>? DanhSachChiTietChuongTrinhDaoTao { get; set; }
    public virtual ICollection<ChiTietLopHocPhan>? DanhSachChiTietLopHocPhan { get; set; }
    public virtual ICollection<LichBieu>? DanhSachLichBieu { get; set; }

}