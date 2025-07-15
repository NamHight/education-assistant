using System.Linq.Expressions;
using DocumentFormat.OpenXml.Wordprocessing;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
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

    public async Task<int> CreateSinhVienLopHocPhanHocBa(Guid maLop, Guid maLhp, Guid maMonHoc,
        int HocKy)
    {
        var parameters = new[]
        {
            new MySqlParameter("maLop", maLop),
            new MySqlParameter("maLhp", maLhp),
            new MySqlParameter("maMonHoc", maMonHoc),
            new MySqlParameter("hocKy", HocKy)
        };
        var result = await _context.Database.ExecuteSqlRawAsync(
            @"CALL sp_taoChiTietLopHocPhanVaHocBa( ?, ?, ?, ?)",
            parameters);
        
        return result;
    }

    public void DeleteLopHocPhan(LopHocPhan lopHocPhan)
    {
        Delete(lopHocPhan);
    }

    public async Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(
        int page, int limit,
        string? search,
        string? sortBy,
        string? sortByOder,
        int? khoa,
        int? loaiChuongTrinh,
        Guid? chuongTrinhId,
        int? hocKy,
        int? trangThai,
        int? loaiLopHoc,
        Guid? giangVienId
    )
    {
        Guid nganhId = Guid.Empty;

        if (chuongTrinhId.HasValue && chuongTrinhId != Guid.Empty)
        {
            var fetchedNganhId = await _context.ChuongTrinhDaoTaos!
                .AsNoTracking()
                .Where(item => item.Id == chuongTrinhId.Value)
                .Select(item => item.NganhId)
                .FirstOrDefaultAsync();

            nganhId = fetchedNganhId ?? Guid.Empty;
        }
        var query = _context.LopHocPhans!
            .AsNoTracking()
            .IgnoreQueryFilters()
            .Where(item => item.DeletedAt == null)
            .Include(x => x.MonHoc)
            .ThenInclude(mh => mh.Khoa)
            .Include(x => x.MonHoc)
            .ThenInclude(mh => mh.DanhSachChiTietChuongTrinhDaoTao)!
            .ThenInclude(ct => ct.ChuongTrinhDaoTao)
            .IgnoreQueryFilters()
            .Include(x => x.GiangVien)
            .AsQueryable();

        if (loaiLopHoc.HasValue && loaiLopHoc != 0)
        {
            query = query.Where(item => item.Loai == loaiLopHoc.Value);
        }

        if (trangThai.HasValue && trangThai != 0)
        {
            System.Console.WriteLine($"tesst trang thai");
            query = query.Where(x => x.TrangThai == trangThai);
        }
            
        
        if (chuongTrinhId.HasValue && chuongTrinhId != Guid.Empty && khoa.HasValue && loaiChuongTrinh.HasValue && hocKy.HasValue)
        {
            query = query.Where(lhp =>
                lhp.MonHoc != null &&
                lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao != null &&
                lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao.Any(ct =>
                    (!chuongTrinhId.HasValue || ct.ChuongTrinhDaoTaoId == chuongTrinhId.Value) &&
                    (!khoa.HasValue || ct.ChuongTrinhDaoTao!.Khoa == khoa.Value) &&
                    (!loaiChuongTrinh.HasValue || ct.ChuongTrinhDaoTao!.LoaiChuonTrinhDaoTao == loaiChuongTrinh.Value) &&
                    (!hocKy.HasValue || ct.HocKy == hocKy.Value)
                ) &&
                (
                    !chuongTrinhId.HasValue ||
                    (!khoa.HasValue || _context.LopHocs!.Any(lh =>
                        lh.NamHoc == khoa.Value &&
                        lh.NganhId == nganhId &&
                        lhp.MaHocPhan.StartsWith(lh.MaLopHoc + "_")
                    ))
                )
            );
        }
        if (giangVienId.HasValue && giangVienId != Guid.Empty)
            query = query.Where(item => item.GiangVienId == giangVienId.Value);
        // Áp dụng search và sort
        query = query
            .SearchBy(search, x => x.MaHocPhan)
            .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<LopHocPhan, object>>>
            {
                ["createdat"] = item => item.CreatedAt,
                ["siso"] = item => item.SiSo
            });
        // Lấy ra PagedListAsync
        var pagedResult = await PagedListAsync<LopHocPhan>.ToPagedListAsync(query, page, limit);

        // Map dữ liệu phức tạp client-side
        var mappedItems = pagedResult.Select(lhp => new LopHocPhan
        {
            Id = lhp.Id,
            MaHocPhan = lhp.MaHocPhan,
            SiSo = lhp.SiSo,
            TrangThai = lhp.TrangThai,
            Loai = lhp.Loai,
            CreatedAt = lhp.CreatedAt,
            GiangVien = lhp.GiangVien != null
                ? new GiangVien
                {
                    Id = lhp.GiangVien.Id,
                    HoTen = lhp.GiangVien.HoTen
                }
                : null,
            GiangVienId = lhp.GiangVienId,
            MonHocId = lhp.MonHocId,
            MonHoc = lhp.MonHoc != null
                ? new MonHoc
                {
                    Id = lhp.MonHoc.Id,
                    TenMonHoc = lhp.MonHoc.TenMonHoc,
                    MaMonHoc = lhp.MonHoc.MaMonHoc,
                    KhoaId = lhp.MonHoc.KhoaId,
                    Khoa = lhp.MonHoc.Khoa,
                    DanhSachChiTietChuongTrinhDaoTao = (chuongTrinhId.HasValue && chuongTrinhId != Guid.Empty && khoa.HasValue && loaiChuongTrinh.HasValue && hocKy.HasValue)
                    ? lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao!
                        .Where(ct =>
                            (!chuongTrinhId.HasValue || ct.ChuongTrinhDaoTaoId == chuongTrinhId) &&
                            (!khoa.HasValue || ct.ChuongTrinhDaoTao!.Khoa == khoa) &&
                            (!loaiChuongTrinh.HasValue || ct.ChuongTrinhDaoTao!.LoaiChuonTrinhDaoTao == loaiChuongTrinh) &&
                            (!hocKy.HasValue || ct.HocKy == hocKy) &&
                            !chuongTrinhId.HasValue || _context.LopHocs!.Any(lh =>
                                lh.NamHoc == khoa!.Value
                                && lh.NganhId == nganhId
                                && lhp.MaHocPhan.StartsWith(lh.MaLopHoc + "_"))
                        )
                        .Select(ct => new ChiTietChuongTrinhDaoTao
                        {
                            Id = ct.Id,
                            HocKy = ct.HocKy,
                            SoTinChi = ct.SoTinChi,
                            DiemTichLuy = ct.DiemTichLuy,
                            LoaiMonHoc = ct.LoaiMonHoc,
                            BoMonId = ct.BoMonId,
                            ChuongTrinhDaoTaoId = ct.ChuongTrinhDaoTaoId,
                            ChuongTrinhDaoTao = new ChuongTrinhDaoTao
                            {
                                Id = ct.ChuongTrinhDaoTao!.Id,
                                MaChuongTrinh = ct.ChuongTrinhDaoTao.MaChuongTrinh,
                                TenChuongTrinh = ct.ChuongTrinhDaoTao.TenChuongTrinh
                            }
                        }).ToList()
                    :   lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao!
                            .Select(ct => new ChiTietChuongTrinhDaoTao
                            {
                                Id = ct.Id,
                                HocKy = ct.HocKy,
                                SoTinChi = ct.SoTinChi,
                                DiemTichLuy = ct.DiemTichLuy,
                                LoaiMonHoc = ct.LoaiMonHoc,
                                BoMonId = ct.BoMonId,
                                ChuongTrinhDaoTaoId = ct.ChuongTrinhDaoTaoId,
                                ChuongTrinhDaoTao = new ChuongTrinhDaoTao
                                {
                                    Id = ct.ChuongTrinhDaoTao!.Id,
                                    MaChuongTrinh = ct.ChuongTrinhDaoTao.MaChuongTrinh,
                                    TenChuongTrinh = ct.ChuongTrinhDaoTao.TenChuongTrinh
                                }
                            }).ToList()
                }
                : null
        }).ToList();

        // Trả về PagedListAsync mới với dữ liệu đã map
        return new PagedListAsync<LopHocPhan>(
            mappedItems,
            pagedResult.PageInfo.TotalCount,
            pagedResult.PageInfo.CurrentPage,
            pagedResult.PageInfo.PageSize);
    }

    public async Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanByGiangVienAsync(int loaiChuongTrinhDaoTao, int khoa,
        int hocKy, Guid giangVienId)
    {
        var giangVienKhoaId = await _context.GiangViens!
            .AsNoTracking()
            .Where(gv => gv.Id == giangVienId)
            .Select(gv => gv.KhoaId)
            .FirstOrDefaultAsync();

        var query = _context.LopHocPhans!
            .AsNoTracking()
            .IgnoreQueryFilters()
            .Where(item => item.DeletedAt == null)
            .Include(lhp => lhp.MonHoc)
            .ThenInclude(mh => mh!.DanhSachChiTietChuongTrinhDaoTao!
                .Where(ct => ct.ChuongTrinhDaoTao != null
                             && ct.ChuongTrinhDaoTao.Khoa == khoa
                             && ct.ChuongTrinhDaoTao.LoaiChuonTrinhDaoTao == loaiChuongTrinhDaoTao
                             && ct.HocKy == hocKy
                             && ct.ChuongTrinhDaoTao.Nganh != null
                             && ct.ChuongTrinhDaoTao.Nganh.KhoaId == giangVienKhoaId))
            .ThenInclude(ct => ct.ChuongTrinhDaoTao)
            .ThenInclude(ctdt => ctdt!.Nganh)
            .ThenInclude(n => n!.Khoa)
            .Include(lhp => lhp.GiangVien)
            .Where(lhp => lhp.GiangVienId == giangVienId
                          && lhp.TrangThai == (int)TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
                          && lhp.GiangVien != null
                          && lhp.GiangVien.Khoa != null
                          && lhp.MonHoc != null
                          && lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao!
                              .Any(ct => ct.ChuongTrinhDaoTao != null
                                         && ct.ChuongTrinhDaoTao.Khoa == khoa
                                         && ct.ChuongTrinhDaoTao.LoaiChuonTrinhDaoTao == loaiChuongTrinhDaoTao
                                         && ct.HocKy == hocKy
                                         && ct.ChuongTrinhDaoTao.Nganh != null
                                         && ct.ChuongTrinhDaoTao.Nganh.KhoaId == giangVienKhoaId
                                         && _context.LopHocs!.Any(lh =>
                                             lh.NamHoc == khoa && lhp.MaHocPhan.StartsWith(lh.MaLopHoc))));

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanByLopHocAndHocKyAsync(int? hocKy, string? maLopHoc, Guid? chuongTrinhDaoTaoId)
    {
        System.Console.WriteLine($"test học kỳ: {hocKy} , chuongtrinhDaotaoId: {chuongTrinhDaoTaoId}, ma lớp: {maLopHoc}");
        var query = _context.LopHocPhans!
                    .AsNoTracking()
                    .Include(lhp => lhp.MonHoc)
                        .ThenInclude(mh => mh.DanhSachChiTietChuongTrinhDaoTao)
                    .Where(lhp => lhp.Loai == (int)LoaiLopHocEnum.LOP_HOC_PHAN && lhp.TrangThai == (int)TrangThaiLopHocPhanEnum.DANG_HOAT_DONG)
                    .AsNoTracking();
        if (hocKy.HasValue && !string.IsNullOrWhiteSpace(maLopHoc) && chuongTrinhDaoTaoId.HasValue && chuongTrinhDaoTaoId != Guid.Empty)
        {
            System.Console.WriteLine($"test mang may tinhtest học kỳ: {hocKy} , chuongtrinhDaotaoId: {chuongTrinhDaoTaoId}, ma lớp: {maLopHoc}");
            query = query.Where(lhp => lhp.MaHocPhan.StartsWith(maLopHoc) &&  lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao.Any(ct => ct.HocKy == hocKy.Value && ct.ChuongTrinhDaoTaoId == chuongTrinhDaoTaoId.Value));
        }
        return await query.ToListAsync();
    }

    public async Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanDaNopAsync(int page, int limit, string search, string sortBy, string sortByOrder, int loaiChuongTrinhDaoTao, Guid khoaId, int hocKy)
    {
        var query = _context.LopHocPhans
                    .AsNoTracking()
                    .Include(lhp => lhp.MonHoc)
                    .ThenInclude(mh => mh!.DanhSachChiTietChuongTrinhDaoTao!
                        .Where(ct => ct.ChuongTrinhDaoTao != null
                                    && ct.ChuongTrinhDaoTao.LoaiChuonTrinhDaoTao == loaiChuongTrinhDaoTao
                                    && ct.HocKy == hocKy
                                    && ct.ChuongTrinhDaoTao.Nganh != null
                                    && ct.ChuongTrinhDaoTao.Nganh.KhoaId == khoaId))
                    .ThenInclude(ct => ct.ChuongTrinhDaoTao)
                    .ThenInclude(ctdt => ctdt!.Nganh)
                    .ThenInclude(n => n!.Khoa)
                    .Include(lhp => lhp.GiangVien)
                    .Where(lhp => lhp.GiangVien != null
                          && lhp.DanhSachChiTietLopHocPhan!.Any(ct => ct.NgayNopDiem != null)
                          && lhp.MonHoc != null
                          && lhp.MonHoc.DanhSachChiTietChuongTrinhDaoTao!
                              .Any(ct => ct.ChuongTrinhDaoTao != null
                                         && ct.ChuongTrinhDaoTao.LoaiChuonTrinhDaoTao == loaiChuongTrinhDaoTao
                                         && ct.HocKy == hocKy
                                         && ct.ChuongTrinhDaoTao.Nganh != null
                                         && ct.ChuongTrinhDaoTao.Nganh.KhoaId == khoaId))
                    .AsQueryable();
        return await PagedListAsync<LopHocPhan>.ToPagedListAsync(query.SearchBy(search, item => item.MaHocPhan)
                                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, System.Linq.Expressions.Expression<Func<LopHocPhan, object>>>
                                                                                {
                                                                                    ["createdat"] = item => item.CreatedAt,
                                                                                    ["updatedat"] = item => item.UpdatedAt!,
                                                                                    ["deletedat"] = item => item.DeletedAt!
                                                                                })
                                                                                , page, limit);
    }

    // var query = _context.ChiTietChuongTrinhDaoTaos!  lhp.MaHocPhan.StartsWith(maLopHoc) &&

    //             .AsNoTracking()
    //             .Include(item => item.MonHoc)
    //                 .ThenInclude(item => item.DanhSachLopHocPhan)
    //             .AsQueryable();
    // if (hocKy.HasValue)
    // {
    //     query = query.Where(item => item.HocKy == hocKy);
    // }
    // if (chuongTrinhDaoTaoId.HasValue && chuongTrinhDaoTaoId != Guid.Empty)
    // {
    //     query = query.Where(item => item.ChuongTrinhDaoTaoId == chuongTrinhDaoTaoId && item.ChuongTrinhDaoTao != null);
    // }
    // var result = query.SelectMany(ct => ct.MonHoc.DanhSachLopHocPhan)
    //                 .AsQueryable();
    // if (!string.IsNullOrEmpty(maLopHoc))
    // {
    //     result = result.Where(lhp => lhp.MaHocPhan.StartsWith(maLopHoc));
    // }
    // return await result.Where(item => item.Loai == (int)LoaiLopHocEnum.LOP_HOC_PHAN && item.TrangThai == (int)TrangThaiLopHocPhanEnum.DANG_HOAT_DONG).ToListAsync();

    public async Task<IEnumerable<LopHocPhan>> GetAllLopHocPhanNoPageAsync()
    {
        return await FindByCondition(item => item.TrangThai == (int)TrangThaiLopHocPhanEnum.DANG_HOAT_DONG && item.DeletedAt == null, false)
                        .IgnoreQueryFilters()
                        .ToListAsync();
    }

    public async Task<LopHocPhan?> GetLopHocPhanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id && item.DeletedAt == null, trackChanges).IgnoreQueryFilters().Include(lhp => lhp.MonHoc)
            .Include(lhp => lhp.GiangVien).FirstOrDefaultAsync();
    }

    public async Task<bool> KiemTraLopHocPhanDaTonTaiAsync(Guid nganhId, int hocKy, int khoa, Guid monHocId)
    {
        var lopHocs = await _context.LopHocs!
            .AsNoTracking()
            .Where(lh => lh.NganhId == nganhId && lh.NamHoc == khoa)
            .ToListAsync();

        if (!lopHocs.Any()) return false;
        var maLopHocs = lopHocs.Select(lh => lh.MaLopHoc).ToList();
        var chiTietLopHocPhans = await _context.ChiTietLopHocPhans!
            .AsNoTracking()
            .Include(ct => ct.LopHocPhan)
            .Where(ct =>
                ct.HocKy == hocKy &&
                ct.LopHocPhan != null &&
                ct.LopHocPhan.MonHocId == monHocId)
            .ToListAsync();

        return chiTietLopHocPhans
            .Any(ct => maLopHocs.Any(maLop => ct.LopHocPhan!.MaHocPhan.StartsWith(maLop + "_")));
    }

    public void UpdateLopHocPhan(LopHocPhan lopHocPhan)
    {
        Update(lopHocPhan);
    }
}