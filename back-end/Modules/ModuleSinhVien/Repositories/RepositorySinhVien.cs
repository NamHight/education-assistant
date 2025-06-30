using System;
using System.Linq.Expressions;
using DocumentFormat.OpenXml.Spreadsheet;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.AspNetCore.Razor.Language;
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
    public async Task<PagedListAsync<SinhVien>?> GetAllSinhVienAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, Guid? lopId, int? tinhTrangHocTap)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Include(item => item.LopHoc)
                    .AsQueryable(); 
        if (lopId.HasValue && lopId != Guid.Empty)
        {
            query = query.Where(lh => lh.LopHocId == lopId);
        }
        if (tinhTrangHocTap.HasValue && tinhTrangHocTap != 0)
        {
            query = query.Where(sv => sv.TinhTrangHocTap == tinhTrangHocTap);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (int.TryParse(search, out var mssv))
            {
                query = query.SearchBy(mssv.ToString(), item => item.MSSV);
            }
            else
            {
                query = query.SearchBy(search, item => item.HoTen);
            }
        }
        return await PagedListAsync<SinhVien>.ToPagedListAsync(query
                                                                .IgnoreQueryFilters()
                                                                .OrderBy(item => item.DeletedAt != null)
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<SinhVien, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                }).AsNoTracking()
                                                                , page, limit);
    }

    public async Task<IEnumerable<SinhVien>> GetAllSinhVienByLopHoc(Guid lopHocId)
    {
        return await FindAll(false).Where(item => item.LopHocId == lopHocId).ToListAsync();
    }

    public async Task<int> GetAllSoCanCaiThienAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.YEU || sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.TRUNG_BINH)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId); 
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoDangHocAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DANG_HOC)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoDaTotNghiepAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.DA_TOT_NGHIEP)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoKhaAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.KHA)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoTamNghiAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TrangThaiSinhVien == (int)TrangThaiSinhVienEnum.TAM_NGHI)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllSoXuatSacAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .Where(sv => sv.TinhTrangHocTap == (int)TinhTrangHocTapSinhVienEnum.XUAT_SAC)
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllTongSoAsync(Guid? lopHocId)
    {
        var query = _context.SinhViens!
                    .AsNoTracking()
                    .AsQueryable();
        if (lopHocId.HasValue && lopHocId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocId == lopHocId);
        }
        return await query.CountAsync();
    }

    public async Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.LopHoc).FirstOrDefaultAsync();
    }

    public async Task<SinhVien?> GetSinhVienByMssvOrCccdAsync(string mssv, string cccd)
    {
        return await FindByCondition(item => item.MSSV == mssv || item.CCCD == cccd, false).FirstOrDefaultAsync();
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
