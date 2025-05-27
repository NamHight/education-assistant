using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("chi_tiet_chuong_trinh_dao_tao")]
public class ChiTietChuongTrinhDaoTao : BaseEntity
{
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc { get; set; }
    [Column("chuong_trinh_dao_tao_id")] public Guid? ChuongTrinhDaoTaoId { get; set; }
    [ForeignKey("ChuongTrinhDaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
}