using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("tai_khoan")]
public class TaiKhoan : BaseEntity
{
    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Column("password")]
    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MaxLength(255, ErrorMessage = "Mật khẩu không được quá 255 ký tự")]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Column("ngay_dang_nhap")] public DateTime? LastLoginDate { get; set; }

    [Column("reset_token")]
    [MaxLength(255)]
    public string? ResetToken { get; set; }

    [Column("reset_expires")] public DateTime? ResetTokenExpires { get; set; }

    [Column("trang_thai")] [Required] public bool Status { get; set; }

    public virtual GiangVien? GiangVien { get; set; }
}