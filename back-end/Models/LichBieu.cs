using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("lich_bieu")]
public class LichBieu : BaseEntity
{
    [Column("tiet_bat_dau")]
    [Required(ErrorMessage = "Tiết bắt đầu không được để trống")]
    public int TietBatDau { get; set; }
    [Column("tiet_ket_thuc")]
    [Required(ErrorMessage = "Tiết bắt đầu không được để trống")]
    public int TietKetThuc { get; set; }
    [Column("thu")]
    [Required(ErrorMessage = "Thứ mấy không được để trống")]
    public int Thu { get; set; }
    [Column("tuan_id")] public Guid? TuanId { get; set; }
    [ForeignKey("TuanId")] public virtual Tuan? Tuan { get; set; }
    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }
    [Column("phong_hoc_id")] public Guid? PhongHocId { get; set; }
    [ForeignKey("PhongHocId")] public virtual PhongHoc? PhongHoc { get; set; }
}