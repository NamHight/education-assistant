using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetTopologySuite.Index.HPRtree;

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

    public async Task<PagedListAsync<LichBieu>> GetAllLichBieuAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, Guid? giangvienId, Guid? tuanId, Guid? boMonId)
    {

        var query = _context.LichBieus!
                    .AsNoTracking()
                    .Include(lb => lb.PhongHoc)
                    .Include(lb => lb.LopHocPhan)!.ThenInclude(lhp => lhp!.GiangVien)
                    .Include(lb => lb.LopHocPhan)!.ThenInclude(lhb => lhb!.MonHoc).ThenInclude(m => m!.DanhSachChiTietChuongTrinhDaoTao)
                    .Include(lb => lb.Tuan)
                    .AsQueryable();
        if (tuanId.HasValue && tuanId != Guid.Empty) 
        {
            query = query.Where(item => item.TuanId == tuanId);
        }
        if (giangvienId.HasValue && giangvienId != Guid.Empty)
        { 
            query = query.Where(item => item.LopHocPhan != null &&
                                        item.LopHocPhan!.GiangVienId == giangvienId);
        }
        if (boMonId.HasValue && boMonId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocPhan != null &&
                                        item.LopHocPhan.MonHoc != null &&
                                        item.LopHocPhan.MonHoc.DanhSachChiTietChuongTrinhDaoTao != null &&
                                        item.LopHocPhan.MonHoc.DanhSachChiTietChuongTrinhDaoTao.Any(ct => ct.BoMonId == boMonId));
        }

        return await PagedListAsync<LichBieu>.ToPagedListAsync(query.SearchBy(search, item => item.Thu.ToString())
                                            .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<LichBieu, object>>>
                                            {
                                                ["createdat"] = item => item.CreatedAt,
                                                ["updatedat"] = item => item.UpdatedAt!,
                                            })
                                            , page, limit);
    }

    public async Task<IEnumerable<LichBieu>> GetAllLichBieuNoPageAsync(string? search, string? sortBy, string? sortByOrder, Guid? giangvienId, Guid? tuanId, Guid? boMonId)
    {
        var query = _context.LichBieus!
                    .AsNoTracking()
                    .Include(lb => lb.PhongHoc)
                    .Include(lb => lb.LopHocPhan)!.ThenInclude(lhp => lhp!.GiangVien)
                    .Include(lb => lb.LopHocPhan)!.ThenInclude(lhb => lhb!.MonHoc).ThenInclude(m => m!.DanhSachChiTietChuongTrinhDaoTao)
                    .Include(lb => lb.Tuan)
                    .AsQueryable();
        query = query.Where(item => item.TuanId == tuanId && item.LopHocPhan != null && item.LopHocPhan!.GiangVienId == giangvienId);
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (int.TryParse(search, out var thu))
            {
                query = query.SearchBy(thu.ToString(), item => item.Thu.ToString());
            }
            else
            {
                query = query.SearchBy(search, item => item.LopHocPhan.MaHocPhan);
            }
        }
        if (boMonId.HasValue && boMonId != Guid.Empty)
        {
            query = query.Where(item => item.LopHocPhan != null &&
                                        item.LopHocPhan.MonHoc != null &&
                                        item.LopHocPhan.MonHoc.DanhSachChiTietChuongTrinhDaoTao != null &&
                                        item.LopHocPhan.MonHoc.DanhSachChiTietChuongTrinhDaoTao.Any(ct => ct.BoMonId == boMonId));
        }

        return await query.SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<LichBieu, object>>>
                            {
                                ["createdat"] = item => item.CreatedAt,
                                ["updatedat"] = item => item.UpdatedAt!,
                            }).ToListAsync(); 
    }

    public Task<IEnumerable<LichBieu>> GetAllLichBieuNoPageLopHocIdAsync(string? search, string? sortBy, string? sortByOrder, int? namHoc, int? hocKy, Guid? lopHocId, Guid? tuanId)
    {
        throw new NotImplementedException();
        
    }

    public async Task<LichBieu?> GetLichBieuByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).Include(item => item.Tuan).Include(item => item.LopHocPhan).Include(item => item.PhongHoc).FirstOrDefaultAsync();
    }
    public void UpdateLichBieu(LichBieu lichBieu)
    {
        Update(lichBieu);
    }
}

