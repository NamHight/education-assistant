using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;
[Table("chuong_trinh_dao_tao")]
public class ChuongTrinhDaoTao : BaseEntity
{
    [Column("ma_chuong_trinh")]
    [Required(ErrorMessage = "Mã chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã chương trình không được quá 255 ký tự")]
    public string MaChuongTrinh { get; set; }

    [Column("ten_chuong_trinh")]
    [Required(ErrorMessage = "Tên chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên chương trình không được quá 255 ký tự")]
    public string TenChuongTrinh { get; set; }

    [Column("loai_bang_cap")]
    [Range(1, 2, ErrorMessage = "Loại bằng cấp không hợp lệ")]
    public int? LoaiBangCap { get; set; }

    [NotMapped]
    public LoaiBangCapEnum? LoaiBangCapEnum
    {
        get => LoaiBangCap.HasValue ? (LoaiBangCapEnum)LoaiBangCap.Value : null;
        set => LoaiBangCap = value.HasValue ? (int)value.Value : null;
    }

    [Column("thoi_gian")] public DateTime ThoiGian { get; set; }
    [Column("hoc_phi")] public decimal HocPhi { get; set; }
    [Column("mo_ta")] public string MoTa {get; set;}
    [Column("tong_so_tin_chi")] public int TongSoTinChi { get; set; }

    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }

    public virtual HoSoHocTap? HoSoHocTap { get; set; }
    public virtual ICollection<MonHocDaoTao>? DanhSachMonHocDaoTao { get; set; }
    public virtual ICollection<SinhVien>? DanhSachSinhVien { get; set; }

}