using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories.SinhVienChuongTrinhDaoTaos;

public class RepositorySinhVienSinhVienChuongTrinhDaoTao : RepositoryBase<SinhVienChuongTrinhDaoTao>,
    IRepositorySinhVienChuongTrinhDaoTao
{
    public RepositorySinhVienSinhVienChuongTrinhDaoTao(RepositoryContext repositoryContext) : base(repositoryContext)
    {
    }

    public async Task<IEnumerable<SinhVienChuongTrinhDaoTao>> getSinhVienChuongTrinhDaoTaoByIdSinhVienAsync(
        Guid idSinhVien)
    {
        return await _context.SinhVienChuongTrinhDaoTaos!.AsNoTracking().Where(sv => sv.SinhVienId.Equals(idSinhVien))
            .Select(sv => new SinhVienChuongTrinhDaoTao
            {
                Id = sv.Id,
                SinhVienId = sv.SinhVienId,
                ChuongTrinhDaoTaoId = sv.ChuongTrinhDaoTaoId
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SinhVienChuongTrinhDaoTao>> GetSinhVienChuongTrinhDaoTaoByIdsAsync(
        List<Guid> idSinhVien)
    {
        return await _context.SinhVienChuongTrinhDaoTaos!.AsNoTracking()
            .Where(sv => idSinhVien.Contains(sv.SinhVienId!.Value))
            .Select(sv => new SinhVienChuongTrinhDaoTao
            {
                Id = sv.Id,
                SinhVienId = sv.SinhVienId,
                ChuongTrinhDaoTaoId = sv.ChuongTrinhDaoTaoId
            })
            .ToListAsync();
    }

    public async Task<List<Guid>> GetAllSinhVienChuongTrinhDaoTaoBySinhVienIdAndChuongTrinhDaoTaoIdAsync(List<Guid> sinhVienIds, Guid chuongTrinhDaoTaoId)
    {
        return await _context.SinhVienChuongTrinhDaoTaos!
                    .AsNoTracking()
                    .Where(item => sinhVienIds.Contains(item.SinhVienId!.Value) && item.ChuongTrinhDaoTaoId == chuongTrinhDaoTaoId)
                    .Select(item => item.SinhVienId!.Value)
                    .ToListAsync();
    }
}