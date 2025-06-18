using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Education_assistant.Modules.ModuleLichBieu.Repositories;

public class RepositoryLichBieu : RepositoryBase<LichBieu>, IRepositoryLichBieu
{
    public RepositoryLichBieu(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(LichBieu lichBieu)
    {
        await Create(lichBieu);
    }

    public void DeleteLichBieu(LichBieu lichBieu)
    {
        Delete(lichBieu);
    }

    public async Task<PagedListAsync<LichBieu>> GetAllLichBieuAsync(int page, int limit)
    {
        return await PagedListAsync<LichBieu>.ToPagedListAsync(_context.LichBieus!.Include(item => item.PhongHoc).Include(item => item.LopHocPhan), page, limit);
    }

    public async Task<IEnumerable<ResponseLichKhoaBieuGiangVienDto>> GetAllLichBieuByGiangVienAsync(int namHoc, Guid giangVienId, Guid tuanId)
    {
        return await _context.LichBieus!
                .AsNoTracking()
                .Where(lb => lb.TuanId == tuanId)
                .Join(
                    _context.Tuans!.Where(t => t.NamHoc == namHoc),
                    lb => lb.TuanId,
                    t => t.Id,
                    (lb, t) => new { LichBieu = lb, Tuan = t }
                )
                .Join(
                    _context.LopHocPhans!.Where(lhp => lhp.GiangVienId == giangVienId),
                    x => x.LichBieu.LopHocPhanId,
                    lhp => lhp.Id,
                    (x, lhp) => new { x.LichBieu, x.Tuan, LopHocPhan = lhp }
                )
                .Join(
                    _context.PhongHocs!,
                    x => x.LichBieu.PhongHocId,
                    ph => ph.Id,
                    (x, ph) => new { x.LichBieu, x.Tuan, x.LopHocPhan, PhongHoc = ph }
                )
                .Join(
                    _context.ChiTietChuongTrinhDaoTaos!,
                    x => x.LopHocPhan.MonHocId,
                    ctctdt => ctctdt.MonHocId,
                    (x , ctctdt) => new {x.LichBieu, x.Tuan, x.LopHocPhan, x.PhongHoc, ChiTietChuongTrinh = ctctdt}
                )
                .Select(x => new ResponseLichKhoaBieuGiangVienDto
                {
                    TenLopHocPhan = x.LopHocPhan.MaHocPhan,
                    LoaiPhongHoc = x.PhongHoc.LoaiPhongHoc,
                    SiSo = x.LopHocPhan.SiSo,
                    TenPhong = x.PhongHoc.TenPhong,
                    Thu = x.LichBieu.Thu,
                    LoaiMonHoc = x.ChiTietChuongTrinh.LoaiMonHoc,
                    TietBatDau = x.LichBieu.TietBatDau,
                    TietKetThuc = x.LichBieu.TietKetThuc,
                    GiangVienId = x.LopHocPhan.GiangVienId!.Value,
                    HoTen = x.LopHocPhan.GiangVien!.HoTen,
                    TuanId = x.LichBieu.TuanId!.Value,
                    SoTuan = x.LichBieu.Tuan!.SoTuan,
                    PhongId = x.LichBieu.PhongHocId!.Value,
                    LopHocPhanId = x.LopHocPhan.Id
                }).ToListAsync();    
    }

    public async Task<LichBieu?> GetLichBieuByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }
    public void UpdateLichBieu(LichBieu lichBieu)
    {
        Update(lichBieu);
    }
}

