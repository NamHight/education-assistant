using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;
[Table("mon_hoc_dao_tao")]
public class MonHocDaoTao : BaseEntity
{
    [Column("mon_hoc_id")] public Guid? MonHocId { get; set; }
    [Column("dao_tao_id")] public Guid? DaoTaoId { get; set; }
    [ForeignKey("MonHocId")] public virtual MonHoc? MonHoc {get; set;}
    [ForeignKey("DaoTaoId")] public virtual ChuongTrinhDaoTao? ChuongTrinhDaoTao { get; set; }
}