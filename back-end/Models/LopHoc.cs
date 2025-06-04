using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("lop_hoc")]
public class LopHoc : BaseEntity
{
    [Column("ma_lop_hoc")]
    [Required(ErrorMessage = "Mã lớp học không được để trống")]
    [MaxLength(255)]
    public string MaLopHoc { get; set; } = string.Empty;

    [Column("si_so")]
    [Required(ErrorMessage = "Sĩ số không được để trống")]
    public int SiSo { get; set; }

    [Column("nam_hoc")]
    [Required(ErrorMessage = "Năm học không được để trống")]
    [MaxLength(10)]
    public string TenLopHoc { get; set; } = string.Empty;

    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }
    [ForeignKey("GiangVienId")] public virtual GiangVien? GiangVien { get; set; }

    [Column("nganh_id")] public Guid? NganhId { get; set; }
    [ForeignKey("NganhId")] public virtual Nganh? Nganh { get; set; }
    public virtual ICollection<SinhVien>? DanhSachSinhVien { get; set; }
}