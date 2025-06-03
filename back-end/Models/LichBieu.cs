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
    [Column("thu_may")]
    [Required(ErrorMessage = "Thứ mấy không được để trống")]
    public int ThuMay { get; set; }
    [Column("tuan_may")]
    [Required(ErrorMessage = "Tuần mấy không được để trống")]
    public int TuanMay { get; set; }
    [Column("nam_hoc")]
    [Required(ErrorMessage = "Năm học không được để trống")]
    public int NamHoc { get; set; }
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("lop_hoc_phan_id")] public Guid? LopHocPhanId { get; set; }
    [ForeignKey("LopHocPhanId")] public virtual LopHocPhan? LopHocPhan { get; set; }
    [Column("phong_hoc_id")] public Guid? PhongHocId { get; set; }
    [ForeignKey("PhongHocId")] public virtual PhongHoc? PhongHoc { get; set; }
}