using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("hoc_ky")]
public class HocKy : BaseEntity
{
    [Column("ma_hoc_ky")]
    [Required(ErrorMessage = "Mã học kỳ không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học kỳ không được quá 255 ký tự")]
    public string MaHocKy { get; set; }

    [Column("ten_hoc_ky")]
    [Required(ErrorMessage = "Tên học kỳ không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên học kỳ không được quá 255 ký tự")]
    public string TenHocKy { get; set; }

    [Column("ngay_bat_dau")] public DateTime? NgayBatDau { get; set; }
    [Column("ngay_ket_thuc")] public DateTime? NgayKetThuc { get; set; }
    [Column("ngay_bat_dau_dang_ky")] public DateTime? NgayBatDauDangky { get; set; }
    [Column("ngay_ket_thuc_dang_ky")] public DateTime? NgayKetThucDangKy { get; set; }

    [Column("nam_hoc")]
    [Required(ErrorMessage = "Năm học không được để trống")]
    [MaxLength(20, ErrorMessage = "Năm học không được quá 20 ký tự")]
    public string NamHoc { get; set; }
    [Column("trang_thai")]
    public string TrangThai { get; set; }

    public virtual ICollection<DiemSo>? DanhSachDiemSo { get; set; }
    public virtual ICollection<LopHocPhan>? DanhSachLopHocPhan { get; set; }
    public virtual ICollection<DiemTong>? DanhSachDiemTong { get; set; }
}

