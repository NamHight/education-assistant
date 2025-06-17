using System.Linq.Expressions;
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

    public async Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string search,
        string sortBy, string sortByOder)
    {
        return await PagedListAsync<LopHocPhan>.ToPagedListAsync(_context.LopHocPhans!
            .SearchBy(search, item => item.MaHocPhan).Include(item => item.MonHoc).Include(item => item.GiangVien)
            .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<LopHocPhan, object>>>
            {
                ["siso"] = item => item.SiSo,
                ["createdat"] = item => item.CreatedAt,
                ["updatedat"] = item => item.UpdatedAt!
            }), page, limit);
    }

    public async Task<IEnumerable<ResponseLopHocPhanWithMonHocDto>> GetAllLopHocPhanCtdtAsync(int khoa, int loaiChuongTrinh, Guid chuongTrinhId, int hocKy)
    {
        return await _context.ChuongTrinhDaoTaos!.Where(ctdt => ctdt.Id == chuongTrinhId && ctdt.Khoa == khoa && ctdt.LoaiChuonTrinhDaoTao == loaiChuongTrinh)
                                                    .SelectMany(ctdt => ctdt.DanhSachChiTietChuongTrinhDaoTao!
                                                    .Where(ctctdt => ctctdt.HocKy == hocKy)
                                                    .SelectMany(ctctdt => ctctdt.MonHoc!.DanhSachLopHocPhan!.Select((lhp => new ResponseLopHocPhanWithMonHocDto
                                                    {
                                                        Id = lhp.Id,
                                                        MaHocPhan = lhp.MaHocPhan,
                                                        SiSo = lhp.SiSo,
                                                        TrangThai = lhp.TrangThai,
                                                        TenMonHoc = ctctdt.MonHoc.TenMonHoc,     
                                                        LoaiMonHoc = ctctdt.LoaiMonHoc,
                                                        MonHocId = lhp.MonHocId,
                                                        GiangVienId = lhp.GiangVienId,
                                                        HoTen = lhp.GiangVien!.HoTen,
                                                        CreatedAt = lhp.CreatedAt,
                                                        UpdatedAt = lhp.UpdatedAt
                                                      
                                                    })))).ToListAsync();                                     
    }
    public async Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateLopHocPhan(LopHocPhan lopHocPhan)
    {
        Update(lopHocPhan);
    }
}