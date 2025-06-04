using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("bo_mon")]
public class BoMon : BaseEntity
{
    [Column("ten_bo_mon")]
    [Required(ErrorMessage = "Mã môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string TenBoMon { get; set; } = string.Empty;
    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Column("so_dien_thoai")]
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(15)]
    public string SoDienThoai { get; set; } = string.Empty;

    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }

    public virtual ICollection<ChiTietChuongTrinhDaoTao>? DanhSachChiTietChuongTrinhDaoTao { get; set; }
    public virtual ICollection<GiangVien>? DanhSachGiangVien { get; set; }
}
