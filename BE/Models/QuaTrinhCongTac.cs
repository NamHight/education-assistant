using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

public class QuaTrinhCongTac : BaseEntity
{
    [Column("vi_tri")]
    [Required(ErrorMessage = "Vị trí không được để trống")]
    [MaxLength(255, ErrorMessage = "Vị trí không được quá 255 ký tự")]
    public string ViTri { get; set; }
    
    [Column("luong")] public decimal Luong { get; set; }
    [Column("ngay_bat_dau")] public DateTime NgayBatDau { get; set; }
    [Column("ngay_ket_thuc")] public DateTime NgayKetThuc { get; set; }
    [Column("cong_tac")] public bool CongTac { get; set; }

    [Column("giang_vien_id")] public Guid? GiangVienId { get; set; }
    [ForeignKey("GiangVienId")] public virtual GiangVien? GiangVien { get; set; }
    [Column("khoa_id")] public Guid? KhoaId { get; set; }
    [ForeignKey("KhoaId")] public virtual Khoa? Khoa { get; set; }

}