using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;

namespace Education_assistant.Models;

[Table("phong_hoc")]
public class PhongHoc : BaseEntity
{
    [Column("ten_phong")]
    [Required(ErrorMessage = "Tên phòng không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên phòng không được quá 255 ký tự")]
    public string TenPhong { get; set; } = string.Empty;
    [Column("toa_nha")]
    [Required(ErrorMessage = "Tòa nhà không được để trống")]
    [MaxLength(255, ErrorMessage = "Tòa nhà không được quá 255 ký tự")]
    public string ToaNha { get; set; } = string.Empty;
    [Column("suc_chua")]
    [Required(ErrorMessage = "Sức chứa không được bỏ trống")]
    public int SucChua { get; set; }


    [Column("loai_phong")]
    public int? LoaiPhongHoc { get; set; }
    [NotMapped]
    public LoaiPhongHocEnum? LoaiPhongHocEnum
    {
        get => LoaiPhongHoc.HasValue ? (LoaiPhongHocEnum)LoaiPhongHoc.Value : null;
        set => LoaiPhongHoc = value.HasValue ? (int)value.Value : null;
    }

    [Column("trang_thai")]
    public int? TrangThaiPhongHoc { get; set; }
    [NotMapped] 
    public TrangThaiPhongHocEnum? TrangThaiPhongHocEnum
    {
        get => TrangThaiPhongHoc.HasValue ? (TrangThaiPhongHocEnum)TrangThaiPhongHoc.Value : null;
        set => TrangThaiPhongHoc = value.HasValue ? (int)value.Value : null;
    }
    public virtual ICollection<LichBieu>? DanhSachLichBieu { get; set; }
}
