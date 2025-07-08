using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories.SinhVienChuongTrinhDaoTaos;

public interface IRepositorySinhVienChuongTrinhDaoTao
{
    Task<IEnumerable<SinhVienChuongTrinhDaoTao>> getSinhVienChuongTrinhDaoTaoByIdSinhVienAsync(Guid idSinhVien);
    Task<List<Guid>> GetAllSinhVienChuongTrinhDaoTaoBySinhVienIdAndChuongTrinhDaoTaoIdAsync(List<Guid> sinhVienIds, Guid chuongTrinhDaoTaoId);


    Task<IEnumerable<SinhVienChuongTrinhDaoTao>> GetSinhVienChuongTrinhDaoTaoByIdsAsync(List<Guid> idSinhVien);
}