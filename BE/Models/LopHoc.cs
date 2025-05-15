using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("lop_hoc")]
public class LopHoc : BaseEntity
{
    [Column("ma_lop_hoc")]
    [Required(ErrorMessage = "Mã lớp học không được để trống")]
    [MaxLength(255)]
    public string MaLopHoc { get; set; }

    [Column("si_so")]
    [Required(ErrorMessage = "Sĩ số không được để trống")]
    public int SiSo { get; set; }

    [Column("nam_hoc")]
    [Required(ErrorMessage = "Năm học không được để trống")]
    [MaxLength(10)]
    public string TenLopHoc { get; set; }

    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }

    [ForeignKey("GiangVienId")] public virtual GiangVien GiangVien { get; set; }
}