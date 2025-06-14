using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Models;

[Table("chuong_trinh_dao_tao")]
public class ChuongTrinhDaoTao : BaseEntity
{
    [Column("ma_chuong_trinh")]
    [Required(ErrorMessage = "Mã chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã chương trình không được quá 255 ký tự")]
    public string MaChuongTrinh { get; set; } = string.Empty;

    [Column("ten_chuong_trinh")]
    [Required(ErrorMessage = "Tên chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên chương trình không được quá 255 ký tự")]
    public string TenChuongTrinh { get; set; } = string.Empty;

    [Column("loai_chuong_trinh_dao_tao")]
    [Range(1, 2, ErrorMessage = "Loại bằng cấp không hợp lệ")]
    public int? LoaiChuonTrinhDaoTao { get; set; }

    [NotMapped]            
    public LoaiChuongTrinhDaoTaoEnum? LoaiChuongTrinhDaoTaoEnum
    {
        get => LoaiChuonTrinhDaoTao.HasValue ? (LoaiChuongTrinhDaoTaoEnum)LoaiChuonTrinhDaoTao.Value : null;
        set => LoaiChuonTrinhDaoTao = value.HasValue ? (int)value.Value : null;
    }

    [Column("thoi_gian_dao_tao")]
    [Required(ErrorMessage = "Thời gian đào tạo không được để trống")]
    public string ThoiGianDaoTao { get; set; } = string.Empty;
    [Column("hoc_phi")][Precision(18,2)] public decimal HocPhi { get; set; }
    [Column("mo_ta")] public string? MoTa { get; set; }
    [Column("tong_so_tin_chi")] public int TongSoTinChi { get; set; }
    [Column("khoa")] public int? Khoa { get; set; }
    [Column("nganh_id")] public Guid? NganhId { get; set; }
    [ForeignKey("NganhId")] public virtual Nganh? Nganh { get; set; }
    public virtual ICollection<SinhVienChuongTrinhDaoTao>? DanhSachSinhVienChuongTrinhDaoTao { get; set; }
    public virtual ICollection<ChiTietChuongTrinhDaoTao>? DanhSachChiTietChuongTrinhDaoTao { get; set; }
}   