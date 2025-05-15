using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;
[Table("sinh_vien")]
public class SinhVien : BaseEntity
{
    [Column("mssv")]
    [Required(ErrorMessage = "Mã số sinh viên không được để trống")]
    public int MSSV { get; set; }

    [Column("cccd")]
    [Required(ErrorMessage = "Căn cước công dân không được để trống")]
    [MaxLength(255, ErrorMessage = "Căn cước công dân không được quá 255 ký tự")]
    public string CCCD { get; set; }

    [Column("anh_dai_dien")]
    [Required(ErrorMessage = "Ảnh đại diện không được để trống")]
    [MaxLength(255, ErrorMessage = "Ảnh đại diện không được quá 255 ký tự")]
    public string AnhDaiDien { get; set; }

    [Column("ho_ten")]
    [Required(ErrorMessage = "Họ và tên không được để trống")]
    [MaxLength(255, ErrorMessage = "Họ và tên không được quá 255 ký tự")]
    public string HoTen { get; set; }

    [Column("email")]
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Column("so_dien_thoai")]
    [MaxLength(15)]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? SoDienThoai { get; set; }

    [Column("ngay_sinh")]
    [DataType(DataType.Date)]
    public DateTime? NgaySinh { get; set; }

    [Column("gioi_tinh")] public int? GioiTinh { get; set; }
    [NotMapped]
    public GioiTinhEnum? GioiTinhEnum
    {
        get => GioiTinh.HasValue ? (GioiTinhEnum)GioiTinh.Value : null;
        set => GioiTinh = value.HasValue ? (int)value.Value : null;
    }

    [Column("dia_chi")]
    [Required(ErrorMessage = "Địa chỉ không được để trống")]
    [MaxLength(255, ErrorMessage = "Địa chỉ không được quá 255 ký tự")]
    public string DiaChi { get; set; } 

    [Column("trang_thai")]
    [Range(1, 5, ErrorMessage = "Giá trị trạng thái không hợp lệ")]
    public int? TrangThai { get; set; }
    [NotMapped]
    public SinhVienTrangThaiEnum? SinhVienTrangThaiEnum
    {
        get => TrangThai.HasValue ? (SinhVienTrangThaiEnum)TrangThai.Value : null;
        set => TrangThai = value.HasValue ? (int)value.Value : null;
    }

    [Column("ngay_tot_nghiep")] public DateTime NgayTotNghiep { get; set; }
    [Column("ngay_nhap_hoc")] public DateTime NgayNhapHoc { get; set; }
    
    [Column("dao_tao_id")] public Guid? DaoTaoId { get; set; }
    [ForeignKey("DaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
    [Column("lop_hoc_id")] public Guid? LopHocId { get; set; }
    [ForeignKey("LopHocId")] public virtual LopHoc? LopHoc { get; set; }

    public virtual HoSoHocTap? HoSoHocTap { get; set; }
    public virtual ICollection<DiemTong>? DanhSachDiemTong { get; set; }
    public virtual ICollection<DangKyMonHoc>? DanhSachDangKyMonHoc { get; set; }
    public virtual ICollection<DiemSo>? DanhSachDiemSo { get; set; }

}