using System.Linq.Expressions;
using DocumentFormat.OpenXml.Office.CustomUI;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories.GiangViens;

public class RepositoryGiangVien : RepositoryBase<GiangVien>, IRepositoryGiangVien
{
    public RepositoryGiangVien(RepositoryContext context) : base(context)
    {
    }

    public async Task<GiangVien?> GetGiangVienByEmailAsync(string email, bool trackChanges)
    {
        return await FindByCondition(gv => gv.Email.Equals(email), trackChanges).Include(g => g.TaiKhoan).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(GiangVien giangVien)
    {
        await Create(giangVien);
    }

    public void DeleteGiangVien(GiangVien giangVien)
    {
        Delete(giangVien);
    }

    public async Task<PagedListAsync<GiangVien>?> GetAllGiangVienAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, Guid? khoaId, Guid? boMonId, bool? active, int? trangThai)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Include(gv => gv.Khoa)
                    .Include(gv => gv.BoMon)
                    .Include(gv => gv.TaiKhoan)
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        if (boMonId.HasValue && boMonId != Guid.Empty)
        {
            query = query.Where(item => item.BoMonId == boMonId);
        }
        if(active.HasValue)
        {
            if (active == true)
            {
                query = query.Where(item => item.DeletedAt == null);
            } 
        }
        if (trangThai.HasValue && trangThai != 0)
        {
            query = query.Where(item => item.TrangThai == trangThai);
        }
        return await PagedListAsync<GiangVien>.ToPagedListAsync(query
            .SearchBy(search, item => item.HoTen!)
            .IgnoreQueryFilters()
            .OrderBy(item => item.DeletedAt != null)
            .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<GiangVien, object>>>
            {
                ["createdat"] = item => item.CreatedAt,
                ["ngaysinh"] = item => item.NgaySinh!,
                ["ngayvaotruong"] = item => item.NgayVaoTruong!,
                ["updatedat"] = item => item.UpdatedAt!
            }).AsNoTracking(), page, limit);
    }

    public async Task<IEnumerable<GiangVien>?> GetAllGiangVienByKhoa(Guid khoaId)
    {
        return await FindByCondition(item => item.KhoaId == khoaId && item.DeletedAt == null, false).IgnoreQueryFilters().ToListAsync();
    }

    public async Task<GiangVien?> GetGiangVienByEmailAsync(string email)
    {
        return await FindByCondition(item => item.Email == email, false).FirstOrDefaultAsync();
    }

    public async Task<GiangVien?> GetGiangVienByIdAsync(Guid? id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges)
            .Include(gv => gv.TaiKhoan)
            .Include(gv => gv.BoMon)
            .Include(gv => gv.Khoa)
            .FirstOrDefaultAsync();
    }

    public async Task<GiangVien?> GetGiangVienDeleteAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).IgnoreQueryFilters().FirstOrDefaultAsync();
    }

    public void UpdateGiangVien(GiangVien giangVien)
    {
        Update(giangVien);
    }

    public async Task<GiangVien?> GetGiangVienByTaiKhoanIdAsync(Guid taiKhoanId, bool trackChanges)
    {
        return await FindByCondition(item => item.TaiKhoanId == taiKhoanId, false).Include(item => item.BoMon).IgnoreQueryFilters().Include(item => item.Khoa).Include(item => item.TaiKhoan).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<GiangVien>?> GetAllGiangVienByBoMonAsync(Guid boMonId)
    {
        return await FindByCondition(item => item.BoMonId == boMonId && item.DeletedAt == null, false).Include(item => item.BoMon).IgnoreQueryFilters().ToListAsync();
    }

    public async Task<IEnumerable<GiangVien>?> GetAllGiangVienNoPageAsync()
    {
        return await FindByCondition(item => item.TrangThai == (int)TrangThaiGiangVienEnum.DANG_CONG_TAC && item.DeletedAt == null, false).IgnoreQueryFilters().ToListAsync();
    }

    public async Task<int> GetAllTrangThainDangCongTacAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.TrangThai == (int)TrangThaiGiangVienEnum.DANG_CONG_TAC)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllTrangThaiNghiViecAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.TrangThai == (int)TrangThaiGiangVienEnum.NGHI_VIEC)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllChucVuGiangVienAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.ChucVu == (int)ChucVuGiangVienEnum.GIANG_VIEN)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllChucVuTruongBoMonAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.ChucVu == (int)ChucVuGiangVienEnum.TRUONG_BO_MON)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllChucVuTruongKhoaAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.ChucVu == (int)ChucVuGiangVienEnum.TRUONG_KHOA)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllChucVuGiangVienChinhAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.ChucVu == (int)ChucVuGiangVienEnum.GIANG_VIEN_CHINH)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllTongSoLuongGiangVienAsync(Guid? khoaId)
    {
        var query = _context.GiangViens!
                    .AsNoTracking()
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }

    public async Task<int> GetAllTrangThaiNghiHuuAsync(Guid? khoaId)
    {
         var query = _context.GiangViens!
                    .AsNoTracking()
                    .Where(gv => gv.TrangThai == (int)TrangThaiGiangVienEnum.NGHI_HUU)
                    .IgnoreQueryFilters()
                    .AsQueryable();
        if (khoaId.HasValue && khoaId != Guid.Empty)
        {
            query = query.Where(item => item.KhoaId == khoaId);
        }
        return await query.CountAsync();
    }
}