using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("hoc_ba")]
public class HocBa : BaseEntity
{
    [Column("diem_tong_ket")]
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; }
    [Column("mo_ta")] public string? MoTa { get; set; }
    [Column("tin_chi")]
    [Required(ErrorMessage = "Tín chỉ không được để trống")]
    public int TinChi { get; set; }
    [Column("hoc_ky")]
    [Required(ErrorMessage = "Học kỳ không được để trống")]
     public int HocKy { get; set; }
    [Column("lan_hoc")] public int LanHoc { get; set; } = 1;
    [Column("ket_qua")]
    [Range(1, 2, ErrorMessage ="Kết quả không hợp lệ")]
    public int? KetQua { get; set; }

    [NotMapped]
    public KetQuaHocBaEnum? KetQuaHocBaEnum
    {
        get => KetQua.HasValue ? (KetQuaHocBaEnum)KetQua.Value : null;
        set => KetQua = value.HasValue ? (int)value.Value : null;
    }

    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }

    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }

    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }

    [Column("chuong_trinh_dao_tao_id")] public Guid? ChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChuongTrinhDaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }


}