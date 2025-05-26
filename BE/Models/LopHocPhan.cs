using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("lop_hoc_phan")]
public class LopHocPhan : BaseEntity
{
    [Column("ma_hoc_phan")]
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public string MaHocPhan { get; set; }

    [Column("phong_hoc")]
    [Required(ErrorMessage = "Phòng học không được để trống")]
    [MaxLength(255, ErrorMessage = "Phòng học không được quá 255 ký tự")]
    public string PhongHoc { get; set; }

    [Column("si_so")]
    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }

    [Column("trang_thai")]
    [Range(1, 2, ErrorMessage = "Trạng thái không hợp lệ")]
    public int? TrangThai { get; set; }

    [NotMapped]
    public LopHocPhanTrangThaiEnum? LopHocPhanTrangThaiEnum
    {
        get => TrangThai.HasValue ? (LopHocPhanTrangThaiEnum)TrangThai.Value : null;
        set => TrangThai = value.HasValue ? (int)value.Value : null;
    }

    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }

    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }
    [ForeignKey("GiangVienId")] public virtual GiangVien? GiangVien { get; set; }

    public virtual ICollection<DangKyMonHoc>? DanhSachDangKyMonHoc { get; set; }
    public virtual ICollection<HocBa>? ĐanhSachHocBa { get; set; }
    public virtual ICollection<ChiTietLopHocPhan>? DanhSachChiTietLopHocPhan { get; set; }
}