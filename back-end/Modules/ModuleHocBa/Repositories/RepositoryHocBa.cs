using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleHocBa.Repositories;

public class RepositoryHocBa : RepositoryBase<HocBa>, IRepositoryHocBa
{
    public RepositoryHocBa(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(HocBa hocBa)
    {
        await Create(hocBa);
    }

    public void DeleteHocBa(HocBa hocBa)
    {
        Delete(hocBa);
    }
//.SearchBy(search, item => item.SinhVien!.HoTen)
    public async Task<PagedListAsync<HocBa>> GetAllHocBaAsync(int page, int limit, string search, string sortBy, string sortByOrder, Guid? lopHocPhanId)
    {
        var query = _context.HocBas!
                    .AsNoTracking()
                    .Include(item => item.SinhVien)
                    .Include(item => item.LopHocPhan)
                    .Include(item => item.ChiTietChuongTrinhDaoTao)
                    .ThenInclude(item => item!.ChuongTrinhDaoTao)
                    .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (int.TryParse(search, out var mssv))
            {
                query = query.SearchBy(mssv.ToString(), item => item.SinhVien!.MSSV);
            }
            else
            {
                query = query.SearchBy(search, item => item.SinhVien!.HoTen);
            }
        }
        query = query.Where(item => item.LopHocPhanId == lopHocPhanId); 
        return await PagedListAsync<HocBa>.ToPagedListAsync(query
                                                    .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<HocBa, object>>>
                                                    {
                                                        ["createdat"] = item => item.CreatedAt,
                                                        ["updatedat"] = item => item.UpdatedAt!,
                                                        ["ketqua"] = item => item.KetQua!,
                                                    }), page, limit);
    }

    public async Task<IEnumerable<HocBa>> GetAllHocBaByIdAsync(List<Guid> ids)
    {
        return await _context.HocBas!.Where(item => ids.Contains(item.Id)).ToListAsync();
    }

    public async Task<IEnumerable<HocBa>> GetAllHocBaByKeysAsync(List<Guid> sinhVienIds, Guid lopHocPhanId, Guid ctctdtId)
    {
        return await _context.HocBas!.AsNoTracking().Where(item => sinhVienIds.Contains(item.SinhVienId!.Value) && item.LopHocPhanId == lopHocPhanId && item.ChiTietChuongTrinhDaoTaoId == ctctdtId).ToListAsync();
    }

    public async Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.SinhVien).Include(item => item.LopHocPhan).Include(item => item.ChiTietChuongTrinhDaoTao).ThenInclude(item => item!.ChuongTrinhDaoTao).FirstOrDefaultAsync();
    }

    public void UpdateHocBa(HocBa hocBa)
    {
        Update(hocBa);
    }
}
