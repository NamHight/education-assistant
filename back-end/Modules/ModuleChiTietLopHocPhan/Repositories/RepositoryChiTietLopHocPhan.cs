using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

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

    public async Task<PagedListAsync<ChiTietLopHocPhan>> GetAllChiTietLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder)
    {
        return await PagedListAsync<ChiTietLopHocPhan>.ToPagedListAsync(_context.ChiTietLopHocPhans!.AsNoTracking()
                                                                , page, limit);
    }

    public async Task<IEnumerable<ResponseDanhSachDiemSoByLopDto>> GetAllDiemSoByLopHocAsync(Guid lopHocPhanId, int hocKy, int loaiMonHoc, int namHoc, Guid chuongTrinhId)
    {
        return await _context.ChiTietLopHocPhans!
                    .AsNoTracking()
                    .Where(ctLhp => ctLhp.LopHocPhanId == lopHocPhanId && ctLhp.HocKy == hocKy)
                    .Join(
                        _context.LopHocPhans!.Where(lhp => lhp.CreatedAt.Year >= namHoc),
                        ctLhp => ctLhp.LopHocPhanId,
                        lhp => lhp.Id,
                        (ctLhp, lhp) => new { ChiTiet = ctLhp, LopHocPhan = lhp }
                    )
                    .Join(
                        _context.ChiTietChuongTrinhDaoTaos!,
                        x => x.LopHocPhan.MonHocId,
                        ctctdt => ctctdt.MonHocId,
                        (x, ctctdt) => new { x.ChiTiet, x.LopHocPhan, ChiTietChuongTrinh = ctctdt }
                    )
                    .Where(x => x.ChiTietChuongTrinh.ChuongTrinhDaoTaoId == chuongTrinhId && x.ChiTietChuongTrinh.LoaiMonHoc == loaiMonHoc)
                    .Join(
                        _context.SinhViens!,
                        x => x.ChiTiet.SinhVienId,
                        sv => sv.Id,
                        (x, sv) => new { x.ChiTiet, x.LopHocPhan, x.ChiTietChuongTrinh, SinhVien = sv }
                    )
                    .Join(
                        _context.LopHocs!,
                        x => x.SinhVien.LopHocId,
                        lop => lop.Id,
                        (x, lop) => new ResponseDanhSachDiemSoByLopDto
                        {
                            Id = x.ChiTiet.Id,
                            DiemChuyenCan = x.ChiTiet.DiemChuyenCan,
                            DiemTrungBinh = x.ChiTiet.DiemTrungBinh,
                            DiemThi1 = x.ChiTiet.DiemThi1,
                            DiemThi2 = x.ChiTiet.DiemThi2,
                            DiemTongKet1 = x.ChiTiet.DiemTongKet1,
                            DiemTongKet2 = x.ChiTiet.DiemTongKet2,
                            NgayLuuDiem = x.ChiTiet.NgayLuuDiem,
                            NgayNopDiem = x.ChiTiet.NgayNopDiem,
                            HocKy = x.ChiTiet.HocKy,
                            GhiChu = x.ChiTiet.GhiChu,
                            TrangThai = x.ChiTiet.TrangThai,
                            SinhVienId = x.ChiTiet.SinhVienId,
                            HoTen = x.SinhVien.HoTen,
                            MSSV = x.SinhVien.MSSV,
                            TenLopHoc = lop.MaLopHoc,
                            GiangVienId = x.ChiTiet.GiangVienId,
                            MonHocId = x.ChiTiet.MonHocId,
                            TenLopHocPhan = x.LopHocPhan.MaHocPhan,
                            LopHocPhanId = x.LopHocPhan.Id
                        }
                    )
                    .ToListAsync();
                    

    }

    public async Task<ChiTietLopHocPhan?> GetChiTietLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateChiTietLopHocPhan(ChiTietLopHocPhan chiTietLopHocPhan)
    {
        Update(chiTietLopHocPhan);
    }
}
