using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office.CustomUI;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;

public class RepositoryChiTietLopHocPhan : RepositoryBase<ChiTietLopHocPhan>, IRepositoryChiTietLopHocPhan
{
    public RepositoryChiTietLopHocPhan(RepositoryContext context) : base(context)
    {
    }
 
    public async Task CreateAsync(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        await Create(chiTietLopHocPhan);
    }

    public void DeleteChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        Delete(chiTietLopHocPhan);
    }

    public async Task DeleteListChiTietLopHocPhan(List<Guid> ids)
    {
        await _context.ChiTietLopHocPhans.Where(c => ids.Contains(c.Id)).ExecuteDeleteAsync();
    }

    public async Task<PagedListAsync<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder, Guid? lopHocPhanId, bool? ngayNopDiem)
    {
        var query = _context.ChiTietLopHocPhans!
                            .AsNoTracking()
                            .Include(item => item.MonHoc)
                            .Include(item => item.GiangVien)
                            .Include(item => item.SinhVien)
                            .Include(item => item.LopHocPhan)
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
        if (ngayNopDiem == true)
        {
            query = query.Where(item => item.NgayNopDiem == null);
        }
        return await PagedListAsync<ChiTietLopHocPhan>.ToPagedListAsync(query
                                                                .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<ChiTietLopHocPhan, object>>>
                                                                {
                                                                    ["createdat"] = item => item.CreatedAt,
                                                                    ["updatedat"] = item => item.UpdatedAt!
                                                                })
                                                                , page, limit);
    }

    public async Task<IEnumerable<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId, string search)
    {
        var query = _context.ChiTietLopHocPhans!
                        .AsNoTracking()
                        .Include(item => item.MonHoc)
                        .Include(item => item.GiangVien)
                        .Include(item => item.SinhVien)
                        .Include(item => item.LopHocPhan)
                        .Where(item => item.NgayNopDiem == null && item.LopHocPhanId == lopHocPhanId)
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
        return await query.ToListAsync();         
    }

    public async Task<List<ResponseExportFileDiemSoDto>> GetAllDiemSoExportFileAsync(Guid lopHocPhanId)
    {
        return await _context.ChiTietLopHocPhans!
                    .AsNoTracking()
                    .Where(ctlhp => ctlhp.LopHocPhanId == lopHocPhanId)
                    .Select(ctlhp => new ResponseExportFileDiemSoDto
                    {
                        MaSinhVien = ctlhp.SinhVien!.MSSV,
                        HoTenSinhVien = ctlhp.SinhVien.HoTen,
                        TenMonHoc = ctlhp.MonHoc!.TenMonHoc,
                        HoTenGiangVien = ctlhp.GiangVien!.HoTen!,
                        DiemChuyenCan = ctlhp.DiemChuyenCan,
                        DiemTrungBinh = ctlhp.DiemTrungBinh,
                        DiemThi1 = ctlhp.DiemThi1,
                        DiemThi2 = ctlhp.DiemThi2,
                        DiemTongKet1 = ctlhp.DiemTongKet1,
                        DiemTongKet2 = ctlhp.DiemTongKet2,
                        HocKy = ctlhp.HocKy,
                        GhiChu = ctlhp.GhiChu!
                    }).ToListAsync();
    }

    public async Task<ChiTietLopHocPhan?> GetByMaSinhVienAndLopHocPhanIdAsync(string maSinhVien, Guid lopHocPhanId)
    {
        return await FindByCondition(item => item.LopHocPhanId == lopHocPhanId && item.SinhVien.MSSV == maSinhVien, false).FirstOrDefaultAsync();

    }

    public async Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges)
                            .Include(item => item.MonHoc)
                            .Include(item => item.GiangVien)
                            .Include(item => item.SinhVien)
                            .Include(item => item.LopHocPhan).FirstOrDefaultAsync();
    }


    public void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        Update(chiTietLopHocPhan);
    }

    public async Task<int> UpdateCtlhpWithPhanCongAsync(Guid maLhp, Guid giangVienId, Guid monHocId)
    {
        var parameters = new[]
        {
            new MySqlParameter("maLhp", maLhp),
            new MySqlParameter("maGiangVien", giangVienId),
            new MySqlParameter("maMonHoc", monHocId),
        };
        var result = await _context.Database.ExecuteSqlRawAsync(
            @"CALL sp_updateChiTietLopHocPhan(?, ?, ?)",
            parameters
        );
        return result;
    }

    public async Task<int> UpdateNgayNopDiemChiTietLopHocPhanByLopHocPhanIdAsync(Guid lopHocPhanId)
    {
        var parameters = new[]
        {
            new MySqlParameter("maLopHocPhan", lopHocPhanId),
        };
        var result = await _context.Database.ExecuteSqlRawAsync(
            @"CALL sp_updateNgayNopDiemChitietLopHocPhan(?)",
            parameters
        );
        return result;
    }
}
