using System;
using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
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

    public async Task<int> CreateSinhVienLopHocPhan(Guid maLop, Guid maLhp, Guid maGiangVien, int HocKy)
    {
        var parameters = new[]
        {
            new MySqlParameter("maLop", maLop),
            new MySqlParameter("maLhp", maLhp),
            new MySqlParameter("maGiangVien", maGiangVien),
            new MySqlParameter("hocKy", HocKy)
        };
        var result = await _context.Database.ExecuteSqlRawAsync(
            @"CALL sp_taoSinhVienChiTietLopHocPhan( ?, ?, ?, ?)",
            parameters);
        return result;
    }

    public void DeleteLopHocPhan(LopHocPhan lopHocPhan)
    {
        Delete(lopHocPhan);
    }

    public async Task<PagedListAsync<LopHocPhan>?> GetAllLopHocPhanAsync(int page, int limit, string search, string sortBy, string sortByOder)
    {
        return await PagedListAsync<LopHocPhan>.ToPagedListAsync(_context.LopHocPhans!.SearchBy(search, item => item.MaHocPhan)
                                                        .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<LopHocPhan, object>>>
                                                        {   
                                                            ["siso"] = item => item.SiSo,
                                                            ["createat"] = item => item.CreatedAt,
                                                            ["updateat"] = item => item.UpdatedAt!,
                                                        }), page, limit);              
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
