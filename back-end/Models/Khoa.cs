
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("khoa")]
public class Khoa : BaseEntity
{
    [Column("ten_khoa")]
    [Required(ErrorMessage = "Tên khoa không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên khoa không được quá 255 ký tự")]
    public string TenKhoa { get; set; }

    [Column("so_dien_thoai")]
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; }

    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Column("vi_tri_phong")]
    [Required(ErrorMessage = "Vị trí phòng không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí phòng không được quá 255 ký tự")]
    public string ViTriPhong { get; set; }

    [Column("website")]
    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; }

    [Column("truong_id")] public Guid? TruongId { get; set; }

    [ForeignKey("TruongId")] public virtual Truong? Truong { get; set; }

    public virtual ICollection<ChuongTrinhDaoTao>? DanhSachChuongTrinhDaoTao { get; set; }
    public virtual ICollection<MonHoc>? DanhSachMonHoc { get; set; }
    public virtual ICollection<GiangVien>? DanhSachGiangVien { get; set; }
}