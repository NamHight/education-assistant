using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("sinh_vien_chuong_trinh_dao_tao")]
public class SinhVienChuongTrinhDaoTao : BaseEntity
{
    [Column("sinh_vien_id")] public Guid? SinhVienId { get; set; }
    [ForeignKey("SinhVienId")] public virtual SinhVien? SinhVien { get; set; }
    [Column("chuong_trinh_dao_tao_id")] public Guid? ChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChuongTrinhDaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
}