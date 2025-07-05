using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;

namespace Education_assistant.Models;

[Table("tai_khoan")]
public class TaiKhoan : BaseEntity
{
    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [MaxLength(255, ErrorMessage = "Email không được quá 255 ký tự")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Column("password")]
    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MaxLength(255, ErrorMessage = "Mật khẩu không được quá 255 ký tự")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    [Column("ngay_dang_nhap")] public DateTime? LastLoginDate { get; set; }

    [Column("reset_token")]
    [MaxLength(255)]
    public string? ResetToken { get; set; }

    [Column("reset_expires")] public DateTime? ResetTokenExpires { get; set; }
    [Column("so_lan_dang_nhap")] public int? TimeLogin { get; set; }
    [Column("khoa_dang_nhap")] public int? LockTime { get; set; }
    [Column("reset-password")] public string? ResetPassword { get; set; }
    [Column("reset-password-expires")] public DateTime? ResetPasswordExpires { get; set; }
    [Column("trang_thai")][Required] public bool Status { get; set; } = true;
    [Column("otp-code")] public string? OtpCode { get; set; }
    [Column("otp-expires")] public DateTime? OtpExpires { get; set; }       

    [Column("loai_tai_khoan")]
    [Range(1, 3, ErrorMessage = "Loại tài khoản không hợp lệ")]
    public int? LoaiTaiKhoan { get; set; }

    public string? OtpCode { get; set; }
    public DateTime? OtpExpires { get; set; }

    [NotMapped]
    public LoaiTaiKhoaEnum? LoaiTaiKhoaEnum
    {
        get => LoaiTaiKhoan.HasValue ? (LoaiTaiKhoaEnum)LoaiTaiKhoan.Value : null;
        set => LoaiTaiKhoan = value.HasValue ? (int)value.Value : null;
    }

    public virtual GiangVien? GiangVien { get; set; }
}