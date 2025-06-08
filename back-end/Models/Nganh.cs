using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("nganh")]
public class Nganh : BaseEntity
{
    [Column("ma_nganh")]
    [Required(ErrorMessage = "Mã ngành không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã ngành không được quá 255 ký tự")]
    public string MaNganh { get; set; } = string.Empty;
    [Column("ten_nganh")]
    [Required(ErrorMessage = "Tên ngành không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên ngành không được quá 255 ký tự")]
    public string TenNganh { get; set; } = string.Empty;
    [Column("mo_ta")]
    public string? MoTa { get; set; }
    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }
    public virtual ICollection<LopHoc>? DanhSachLopHoc { get; set; }
}
