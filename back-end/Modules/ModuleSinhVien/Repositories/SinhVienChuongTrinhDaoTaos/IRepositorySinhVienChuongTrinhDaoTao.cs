using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories.SinhVienChuongTrinhDaoTaos;

public interface IRepositorySinhVienChuongTrinhDaoTao
{
    Task<IEnumerable<SinhVienChuongTrinhDaoTao>> getSinhVienChuongTrinhDaoTaoByIdSinhVienAsync(Guid idSinhVien);

    Task<IEnumerable<SinhVienChuongTrinhDaoTao>> GetSinhVienChuongTrinhDaoTaoByIdsAsync(List<Guid> idSinhVien);
}