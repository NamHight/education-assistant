using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;

namespace Education_assistant.Models;

[Table("giang_vien")]
public class GiangVien : BaseEntity
{
    [Column("ho_ten")][MaxLength(255)] public string? HoTen { get; set; }

    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Column("chuc_vu")]
    [Range(1, 6, ErrorMessage = "Chức vụ không hợp lệ")]
    [Required(ErrorMessage = "Chức vụ không được để trống")]
    public int? ChucVu { get; set; }

    [NotMapped]
    public ChucVuGiangVienEnum? ChucVuGiangVienEnum
    {
        get => ChucVu.HasValue ? (ChucVuGiangVienEnum)ChucVu.Value : null;
        set => ChucVu = value.HasValue ? (int)value.Value : null;
    }
    [Column("gioi_tinh")]
    [Range(1, 3, ErrorMessage = "Giới tính không hợp lệ")]
    public int? GioiTinh { get; set; }
    [NotMapped]
    public GioiTinhEnum? GioiTinhEnum
    {
        get => GioiTinh.HasValue ? (GioiTinhEnum)GioiTinh.Value : null;
        set => GioiTinh = value.HasValue ? (int)value.Value : null;
    }

    [Column("ngay_sinh")]
    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    [Column("cccd")]
    [Required(ErrorMessage = "CCCD không được để trống")]
    [MaxLength(255)]
    public string CCCD { get; set; } = string.Empty;

    [Column("so_dien_thoai")]
    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }

    [Column("dia_chi")] public string? DiaChi { get; set; }

    [Column("ngay_vao_truong")]
    [DataType(DataType.Date)]
    public DateTime? NgayVaoTruong { get; set; }

    [Column("trinh_do")][MaxLength(255)] public string? TrinhDo { get; set; }

    [Column("chuyen_nganh")]
    [MaxLength(255)]
    public string? ChuyenNganh { get; set; }

    [Column("anh_dai_dien")] public string? AnhDaiDien { get; set; }

    [Column("trang_thai_giang_vien")]
    [Range(1, 4, ErrorMessage = "Giá trị trạng thái không hợp lệ")]
    public int? TrangThai { get; set; }

    [NotMapped]
    public TrangThaiGiangVienEnum? TrangThaiGiangVienEnum
    {
        get => TrangThai.HasValue ? (TrangThaiGiangVienEnum)TrangThai.Value : null;
        set => TrangThai = value.HasValue ? (int)value.Value : null;
    }

    public virtual ICollection<LopHoc>? DanhSachLopHoc { get; set; }

    [Column("tai_khoan_id")] public Guid? TaiKhoanId { get; set; }
    [ForeignKey("TaiKhoanId")] public virtual TaiKhoan? TaiKhoan { get; set; }
    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }
    [Column("bo_mon_id")] public Guid? BoMonId { get; set; }
    [ForeignKey("BoMonId")] public virtual BoMon? BoMon { get; set; }
    public virtual ICollection<LopHocPhan>? DanhSachLopHocPhan { get; set; }
    public virtual ICollection<ChiTietLopHocPhan>? DanhSachChiTietLopHocPhan { get; set; }
}