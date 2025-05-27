using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("truong")]
public class Truong : BaseEntity
{
    [Column("ma_truong")]
    [Required(ErrorMessage = "Mã trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã trường không được quá 255 ký tự")]
    public string MaTruong { get; set; }

    [Column("ten_truong")]
    [Required(ErrorMessage = "Tên trường không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên trường không được quá 255 ký tự")]
    public string TenTruong { get; set; }

    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Column("vi_tri")]
    [Required(ErrorMessage = "Vị trí không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí không được quá 255 ký tự")]
    public string ViTri { get; set; }
    
    [Column("so_dien_thoai")]
    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [MaxLength(255, ErrorMessage = "Số điện thoại không được quá 255 ký tự")]
    public string SoDienThoai { get; set; }

    [Column("website")]
    [Required(ErrorMessage = "Website không được để trống")]
    [MaxLength(255, ErrorMessage = "Website không được quá 255 ký tự")]
    public string Website { get; set; }

    public virtual ICollection<Khoa>? DanhSachKhoa {get; set;}
}