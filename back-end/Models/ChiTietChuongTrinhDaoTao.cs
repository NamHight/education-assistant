using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models.Enums;

namespace Education_assistant.Models;

[Table("chi_tiet_chuong_trinh_dao_tao")]
public class ChiTietChuongTrinhDaoTao : BaseEntity
{
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("chuong_trinh_dao_tao_id")] public Guid? ChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChuongTrinhDaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
    [Column("bo_mon_id")] public Guid? BoMonId { get; set; }
    [ForeignKey("BoMonId")] public virtual BoMon? BoMon { get; set; }

    [Column("so_tin_chi")]
    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }
    [Column("hoc_ky")]
    [Required(ErrorMessage = "Học Kỳ không được để trống")]
    public int HocKy { get; set; }
    [Column("diem_tich_luy")]
    public bool DiemTichLuy { get; set; } = false;
    [Column("loai_mon_hoc")]
    [Range(1, 10, ErrorMessage = "Loại môn học không hợp lệ")]
    public int? LoaiMonHoc { get; set; }
    [NotMapped]
    public LoaiMonHocEnum? LoaiMonHocEnum
    {
        get => LoaiMonHoc.HasValue ? (LoaiMonHocEnum)LoaiMonHoc.Value : null;
        set => LoaiMonHoc = value.HasValue ? (int)value.Value : null;
    }
    public virtual ICollection<HocBa>? DanhSachHocBa { get; set; }
}