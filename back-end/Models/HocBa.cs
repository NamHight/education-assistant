using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Models;

[Table("hoc_ba")]
public class HocBa : BaseEntity
{
    [Column("diem_tong_ket")]
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    [Precision(4,2)] 
    public decimal DiemTongKet { get; set; }
    [Column("mo_ta")] public string? MoTa { get; set; }
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

    [Column("chi_tiet_chuong_trinh_dao_tao_id")] public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChiTietChuongTrinhDaoTaoId")] public virtual ChiTietChuongTrinhDaoTao? ChiTietChuongTrinhDaoTao { get; set; }
}