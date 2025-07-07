using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public class RepositorySinhVien : RepositoryBase<SinhVien>, IRepositorySinhVien
{
    public RepositorySinhVien(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(SinhVien sinhVien)
    {
        await Create(sinhVien);
    }

    public void DeleteSinhVien(SinhVien sinhVien)
    {
        Delete(sinhVien);
    }

    public async Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string? search,
        string? sortBy, string? sortByOrder, Guid? lopId, int? tinhTrangHocTap)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Include(item => item.LopHoc)
            .AsQueryable();
        if (lopId.HasValue && lopId != Guid.Empty) query = query.Where(lh => lh.LopHocId == lopId);
        if (tinhTrangHocTap.HasValue && tinhTrangHocTap != 0)
            query = query.Where(sv => sv.TinhTrangHocTap == tinhTrangHocTap);
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (int.TryParse(search, out var mssv))
                query = query.SearchBy(mssv.ToString(), item => item.MSSV);
            else
                query = query.SearchBy(search, item => item.HoTen);
        }

        return await PagedListAsync<SinhVien>.ToPagedListAsync(query
                .IgnoreQueryFilters()
                .OrderBy(item => item.DeletedAt != null)
                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                {
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!
                }).AsNoTracking()
            , page, limit);
    }

    public async Task<IEnumerable<SinhVien>> GetAllSinhVienByLopHoc(Guid lopHocId)
    {
        return await FindAll(false).Where(item => item.LopHocId == lopHocId).ToListAsync();
    }

    public async Task<PagedListAsync<SinhVien>> GetAllSinhVienByLopHocPhanIdAsync(int page, int limit, string? search,
        string? sortBy, string? sortByOrder, Guid lopHocPhanId)
    {
        var query = _context.DangKyMonHocs!
            .AsNoTracking()
            .IgnoreQueryFilters()
            .Where(item => item.LopHocPhanId == lopHocPhanId)
            .Where(item => item.SinhVien != null &&
                           item.SinhVien.DeletedAt == null &&
                           item.SinhVien.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DANG_HOC)
            .Include(item => item.SinhVien)
            .ThenInclude(item => item.LopHoc)
            .Select(item => item.SinhVien!)
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (int.TryParse(search, out var mssv))
                query = query.SearchBy(mssv.ToString(), item => item.MSSV);
            else
                query = query.SearchBy(search, item => item.HoTen);
        }

        return await PagedListAsync<SinhVien>.ToPagedListAsync(query
                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                {
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!
                }).AsNoTracking()
            , page, limit);
    }

    public async Task<List<ResponseExportFileSinhVienDto>> GetAllSinhVienExportFileAsync(Guid lopHocId)
    {
        return await _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.LopHocId == lopHocId)
            .Include(sv => sv.LopHoc)
            .Select(sv => new ResponseExportFileSinhVienDto
            {
                MSSV = sv.MSSV,
                CCCD = sv.CCCD,
                HoTen = sv.HoTen,
                Email = sv.HoTen,
                SoDienThoai = sv.SoDienThoai,
                NgaySinh = sv.NgaySinh,
                GioiTinh = sv.GioiTinh == 1 ? "Nam" : "Nữ",
                DiaChi = sv.DiaChi,
                NgayNhapHoc = sv.NgayNhapHoc,
                NgayTotNghiep = sv.NgayTotNghiep,
                TenLop = sv.LopHoc.MaLopHoc
            }).ToListAsync();
    }

    public async Task<int> GetAllSoCanCaiThienAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv =>
                sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.YEU ||
                sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.TRUNG_BINH)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoDangHocAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DANG_HOC)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoDaTotNghiepAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DA_TOT_NGHIEP)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoKhaAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.KHA)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoTamNghiAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.TAM_NGHI)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoXuatSacAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .Where(sv => sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.XUAT_SAC)
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<int> GetAllTongSoAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
            .AsNoTracking()
            .IgnoreQueryFilters()
            .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty) query = query.Where(item => item.LopHocId == lopHocId);
        return await query.CountAsync();
    }

    public async Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.LopHoc)
            .FirstOrDefaultAsync();
    }

    public async Task<SinhVien?> GetSinhVienByMssvAsync(string mssv, bool trackChanges)
    {
        return await FindByCondition(
                item => item.MSSV == mssv && item.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DANG_HOC &&
                        item.DeletedAt == null, trackChanges).IgnoreQueryFilters().Include(item => item.LopHoc)
            .FirstOrDefaultAsync();
    }

    public async Task<List<SinhVien>> GetAllSinhVienByIds(List<Guid> ids, bool trackChanges)
    {
        return trackChanges
            ? await FindByCondition(item => ids.Contains(item.Id), true).Include(item => item.LopHoc).ToListAsync()
            : await FindByCondition(item => ids.Contains(item.Id), false).Include(item => item.LopHoc)
                .IgnoreQueryFilters().ToListAsync();
    }

    public async Task<SinhVien?> GetSinhVienByMssvOrCccdAsync(string mssv, string cccd)
    {
        return await FindByCondition(item => item.MSSV == mssv || item.CCCD == cccd, false).IgnoreQueryFilters()
            .FirstOrDefaultAsync();
    }

    public async Task<SinhVien?> GetSinhVienDeleteAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).IgnoreQueryFilters().FirstOrDefaultAsync();
    }

    public void UpdateSinhVien(SinhVien sinhVien)
    {
        Update(sinhVien);
    }
}