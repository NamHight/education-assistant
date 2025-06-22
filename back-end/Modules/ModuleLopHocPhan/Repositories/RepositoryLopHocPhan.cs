using System.Linq.Expressions;
using DocumentFormat.OpenXml.Office.CustomUI;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace Education_assistant.Modules.ModuleLopHocPhan.Repositories;

public class RepositoryLopHocPhan : RepositoryBase<LopHocPhan>, IRepositoryLopHocPhan
{
    public RepositoryLopHocPhan(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(LopHocPhan lopHocPhan)
    {
        await Create(lopHocPhan);
    }

    public async Task<int> CreateSinhVienLopHocPhanHocBa(Guid maLop, Guid maLhp, Guid? maGiangVien, Guid maMonHoc, Guid maCtctdt, int HocKy)
    {
        var parameters = new[]
        {
            new MySqlParameter("maLop", maLop),
            new MySqlParameter("maLhp", maLhp),
            new MySqlParameter("maGiangVien", maGiangVien),
            new MySqlParameter("maMonHoc", maMonHoc),
            new MySqlParameter("maChiTietCTDT", maCtctdt),
            new MySqlParameter("hocKy", HocKy)
        };
        var result = await _context.Database.ExecuteSqlRawAsync(
            @"CALL sp_taoChiTietLopHocPhanVaHocBa( ?, ?, ?, ?, ?, ?)",
            parameters);
        return result;
    }

    public void DeleteLopHocPhan(LopHocPhan lopHocPhan)
    {
        Delete(lopHocPhan);
    }

    public async Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string? search, string? sortBy, string? sortByOder, int? khoa, int? loaiChuongTrinh, Guid? chuongTrinhId, int? hocKy, int? trangThai)
    {
        var query = _context.LopHocPhans!
                    .AsNoTracking()
                    .Include(lhp => lhp.GiangVien)
                    .Include(lhp => lhp.MonHoc)
                    .AsQueryable();
        if (trangThai.HasValue && trangThai != 0)
        {
            query = query.Where(item => item.TrangThai == trangThai);
        }
        if (khoa.HasValue && khoa != 0)
        {
            query = query.Where(lhp => lhp.MonHoc!.DanhSachChiTietChuongTrinhDaoTao!
                            .Any(ct => ct.ChuongTrinhDaoTao!.Khoa == khoa.Value));
        }
        if (loaiChuongTrinh.HasValue && loaiChuongTrinh != 0) {
            query = query.Where(lhp => lhp.MonHoc!.DanhSachChiTietChuongTrinhDaoTao!
                            .Any(ct => ct.ChuongTrinhDaoTao!.LoaiChuonTrinhDaoTao == loaiChuongTrinh.Value));
        }
        if (chuongTrinhId.HasValue && chuongTrinhId != Guid.Empty) {
            query = query.Where(lhp => lhp.MonHoc!.DanhSachChiTietChuongTrinhDaoTao!
                            .Any(ct => ct.ChuongTrinhDaoTaoId == chuongTrinhId.Value));
        }
        if (hocKy.HasValue && hocKy != 0) {
            query = query.Where(lhp => lhp.MonHoc!.DanhSachChiTietChuongTrinhDaoTao!
                            .Any(ct => ct.HocKy == hocKy.Value));
        }
        return await PagedListAsync<LopHocPhan>.ToPagedListAsync(query
            .SearchBy(search, item => item.MaHocPhan)
            .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<LopHocPhan, object>>>
            {
                ["siso"] = item => item.SiSo,
                ["createdat"] = item => item.CreatedAt,
                ["updatedat"] = item => item.UpdatedAt!
            }), page, limit);
    }

    public async Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.MonHoc).Include(item => item.GiangVien).FirstOrDefaultAsync();
    }

    public void UpdateLopHocPhan(LopHocPhan lopHocPhan)
    {
        Update(lopHocPhan);
    }
}