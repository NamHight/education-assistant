using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("ho_so_hoc_tap")]
public class HoSoHocTap : BaseEntity
{
    [Column("ngay_nhap_hoc")] public DateTime? NgayNhapHoc { get; set; }
    [Column("ngay_tot_nghiep")] public DateTime? NgayTotNghiep { get; set; }

    [Column("gpa")] public decimal GPA { get; set; }

    [Column("tin_chi")] public int TinChi { get; set; }
    [Column("tinh_trang")] 
    [Range(1, 5, ErrorMessage = "Giá trị tình trạng không hợp lệ")]
    public int? TinhTrang { get; set; }

    [NotMapped]
    public HosoHocTapTinhTrangEnum? TinhTrangEnum 
    { 
        get => TinhTrang.HasValue ? (HosoHocTapTinhTrangEnum)TinhTrang.Value : null; 
        set => TinhTrang = value.HasValue ? (int)value.Value : null;
    }

    [Column("tot_nghiep")]
    public bool TotNghiep { get; set; }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }
    [Column("chuong_trinh_dao_tao_id")] public Guid? ChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChuongTrinhDaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
}