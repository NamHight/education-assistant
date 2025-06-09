using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("tuan")]
public class Tuan : BaseEntity
{
    [Column("so_tuan")]
    [Required(ErrorMessage = "Số tuần không được để trống")]
    public int SoTuan { get; set; }
    [Column("nam_hoc")]
    [Required(ErrorMessage = "Năm học không được để trống")]
    public int NamHoc { get; set; }
    [Column("ngay_bat_dau")] public DateTime? NgayBatDau { get; set; }
    [Column("ngay_ket_thuc")] public DateTime? NgayKetThuc { get; set; }
    public virtual ICollection<LichBieu>? DanhSachLichBieu { get; set; }
}
