using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("lich_bieu")]
public class LichBieu : BaseEntity
{
    [Column("thoi_gian_bat_dau_hoc")] public DateTime ThoiGianBatDauHoc { get; set; }
    [Column("thoi_gian_ket_thuc_hoc")] public DateTime ThoiGianKetThucHoc { get; set; }
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }
}