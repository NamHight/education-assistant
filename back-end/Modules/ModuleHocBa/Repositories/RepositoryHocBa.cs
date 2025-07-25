using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
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
    public async Task<PagedListAsync<HocBa>> GetAllHocBaAsync(int page, int limit, string search, string sortBy,
        string sortByOrder, Guid? lopHocPhanId, Guid? sinhVienId)
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
                query = query.SearchBy(mssv.ToString(), item => item.SinhVien!.MSSV);
            else
                query = query.SearchBy(search, item => item.SinhVien!.HoTen);
        }

        if (sinhVienId.HasValue && sinhVienId != Guid.Empty) query = query.Where(item => item.SinhVienId == sinhVienId);
        if (lopHocPhanId.HasValue && lopHocPhanId != Guid.Empty)
            query = query.Where(item => item.LopHocPhanId == lopHocPhanId);
        return await PagedListAsync<HocBa>.ToPagedListAsync(query
            .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<HocBa, object>>>
            {
                ["createdat"] = item => item.CreatedAt,
                ["updatedat"] = item => item.UpdatedAt!,
                ["ketqua"] = item => item.KetQua!
            }), page, limit);
    }

    public async Task<IEnumerable<HocBa>> GetAllHocBaByIdAsync(List<Guid> ids)
    {
        return await _context.HocBas!.Where(item => ids.Contains(item.Id)).ToListAsync();
    }

    public async Task<IEnumerable<HocBa>> GetAllHocBaByKeysAsync(List<Guid> sinhVienIds, Guid ctctdtId)
    {
        return await _context.HocBas!.AsNoTracking().Where(item =>
            sinhVienIds.Contains(item.SinhVienId!.Value) && item.ChiTietChuongTrinhDaoTaoId == ctctdtId).ToListAsync();
    }

    public async Task<IEnumerable<ResponseHocBaProfileDto>> GetAllHocBaBySinhVienAsync(string sortBy,
        string sortByOrder, Guid sinhVienId)
    {
        var query = _context.HocBas!
            .AsNoTracking()
            .Include(item => item.SinhVien)
            .Include(item => item.LopHocPhan)
            .Include(item => item.ChiTietChuongTrinhDaoTao)
            .ThenInclude(ctdt => ctdt.MonHoc)
            .Include(item => item.ChiTietChuongTrinhDaoTao)
            .ThenInclude(ctdt => ctdt.ChuongTrinhDaoTao)
            .AsQueryable();
        query = query.Where(item => item.SinhVienId == sinhVienId && item.UpdatedAt != null);
        return await query.GroupBy(hb => hb.ChiTietChuongTrinhDaoTao!.HocKy).Select(x => new ResponseHocBaProfileDto
        {
            HocKy = x.Key,
            SinhVien = new SinhVienSimpleWithLopHocDto
            {
                Id = x.First().SinhVien!.Id,
                HoTen = x.First().SinhVien!.HoTen,
                MSSV = x.First().SinhVien!.MSSV,
                AnhDaiDien = x.First().SinhVien!.AnhDaiDien,
                GioiTinh = x.First().SinhVien!.GioiTinh,
                NgaySinh = x.First().SinhVien!.NgaySinh,
                LopHoc = new LopHocSimpleDto
                {
                    Id = x.First().SinhVien!.LopHoc!.Id,
                    MaLopHoc = x.First().SinhVien!.LopHoc!.MaLopHoc
                }
            },
            ListHocBa = x.ToList(),
            DiemTongKet = Math.Round(x.ToList()
                    .Where(hb => hb.DiemTongKet != null && hb.UpdatedAt != null)
                    .Sum(hb => hb.DiemTongKet * hb.ChiTietChuongTrinhDaoTao!.SoTinChi) /
                x.ToList().Sum(hb => hb.ChiTietChuongTrinhDaoTao!.SoTinChi) ?? 0, 2)
        }).ToListAsync();
    }

    public async Task<HocBa?> GetHocBaByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.SinhVien)
            .Include(item => item.LopHocPhan)
            .Include(item => item.LopHocPhan).Include(item => item.ChiTietChuongTrinhDaoTao)
            .ThenInclude(item => item!.ChuongTrinhDaoTao).FirstOrDefaultAsync();
    }

    public async Task<HocBa?> GetHocBaByLopHocPhanIdAsync(Guid lopHocPhanId)
    {
        return await FindByCondition(item => item.LopHocPhanId == lopHocPhanId, false).FirstOrDefaultAsync();
    }

    public async Task<HocBa?> GetHocBaBySinhVienAndLopHocPhanAsync(Guid sinhVienId, Guid lopHocPhanId)
    {
        return await FindByCondition(item => item.SinhVienId == sinhVienId && item.LopHocPhanId == lopHocPhanId, false)
            .FirstOrDefaultAsync();
    }

    public async Task<List<(Guid, Guid)>> GetIdSinhVienAndIdChiTietByListSinhVienAndListChiTietAsync(
        List<Guid> sinhVienIds, List<Guid> chiTietIds)
    {
        return await FindAll(false).Where(item =>
                sinhVienIds.Contains(item.SinhVienId.Value) &&
                chiTietIds.Contains(item.ChiTietChuongTrinhDaoTaoId.Value))
            .Select(hb => new ValueTuple<Guid, Guid>(hb.SinhVienId.Value, hb.ChiTietChuongTrinhDaoTaoId.Value))
            .ToListAsync();
    }

    public async Task<decimal?> TinhGPAAsync(Guid sinhVienId)
    {
        var hocBas = await _context.HocBas!
            .Include(hb => hb.ChiTietChuongTrinhDaoTao)
            .Where(hb => hb.SinhVienId == sinhVienId
                         && hb.DiemTongKet != null
                         && hb.UpdatedAt != null
                         && hb.ChiTietChuongTrinhDaoTao != null
                         && hb.ChiTietChuongTrinhDaoTao.SoTinChi > 0
                         && hb.ChiTietChuongTrinhDaoTao.DiemTichLuy == true
            )
            .ToListAsync();
        if (!hocBas.Any()) return null;
        var tongTinChi = hocBas.Sum(hb => hb.ChiTietChuongTrinhDaoTao!.SoTinChi);
        if (tongTinChi == 0) return null;

        var diemCaoNhat = hocBas
            .GroupBy(hb => hb.ChiTietChuongTrinhDaoTao!.MonHocId)
            .Select(group => group.OrderByDescending(hb => hb.DiemTongKet).First())
            .ToList();
        var DiemTongXTinChi = diemCaoNhat.Sum(hb => hb.DiemTongKet * hb.ChiTietChuongTrinhDaoTao!.SoTinChi);
        return Math.Round(DiemTongXTinChi.Value / tongTinChi, 2);
    }


    public async Task<decimal?> TinhGPAAsync2(RepositoryContext context, Guid sinhVienId)
    {
        var hocBas = await context.HocBas!
            .Include(hb => hb.ChiTietChuongTrinhDaoTao)
            .Where(hb => hb.SinhVienId == sinhVienId
                         && hb.DiemTongKet != null
                         && hb.UpdatedAt != null
                         && hb.ChiTietChuongTrinhDaoTao != null
                         && hb.ChiTietChuongTrinhDaoTao.SoTinChi > 0
                         && hb.ChiTietChuongTrinhDaoTao.DiemTichLuy == true
            )
            .ToListAsync();
        if (!hocBas.Any()) return null;
        var tongTinChi = hocBas.Sum(hb => hb.ChiTietChuongTrinhDaoTao!.SoTinChi);
        if (tongTinChi == 0) return null;

        var diemCaoNhat = hocBas
            .GroupBy(hb => hb.ChiTietChuongTrinhDaoTao!.MonHocId)
            .Select(group => group.OrderByDescending(hb => hb.DiemTongKet).First())
            .ToList();
        var DiemTongXTinChi = diemCaoNhat.Sum(hb => hb.DiemTongKet * hb.ChiTietChuongTrinhDaoTao!.SoTinChi);
        return Math.Round(DiemTongXTinChi.Value / tongTinChi, 2);
    }

    public void UpdateHocBa(HocBa hocBa)
    {
        Update(hocBa);
    }
}