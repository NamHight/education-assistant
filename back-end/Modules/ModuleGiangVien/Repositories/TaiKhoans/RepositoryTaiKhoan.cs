using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories.TaiKhoans;

public class RepositoryTaiKhoan : RepositoryBase<TaiKhoan>, IRepositoryTaiKhoan
{
    public RepositoryTaiKhoan(RepositoryContext context) : base(context)
    {
    }

    public async Task<TaiKhoan?> GetTaiKhoanByRefreshTokenAsync(string refreshToken, bool trackChanges)
    {
        return await FindByCondition(tk => tk.ResetToken.Equals(refreshToken), trackChanges).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(TaiKhoan taiKhoan)
    {
        await Create(taiKhoan);
    }

    public void DeleteTaiKhoan(TaiKhoan taiKhoan)
    {
        Delete(taiKhoan);
    }

    public async Task<PagedListAsync<TaiKhoan>?> GetAllTaiKhoanAsync(int page, int limit, string search, string sortBy,
        string sortByOder)
    {
        return await PagedListAsync<TaiKhoan>.ToPagedListAsync(_context.TaiKhoans!
                .SearchBy(search, item => item.Email)
                .SortByOptions(sortBy, sortByOder, new Dictionary<string, Expression<Func<TaiKhoan, object>>>
                {
                    ["createdat"] = item => item.CreatedAt,
                    ["updatedat"] = item => item.UpdatedAt!,
                    ["deletedat"] = item => item.DeletedAt!
                })
            , page, limit);
    }

    public async Task<TaiKhoan?> GetTaiKhoanByEmailAsync(string email, bool trackChanges)
    {
        return await FindByCondition(item => item.Email.Equals(email), trackChanges)
            .FirstOrDefaultAsync();
    }

    public async Task<TaiKhoan?> GetTaiKhoanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id.Equals(id), trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateTaiKhoan(TaiKhoan taiKhoan)
    {
        Update(taiKhoan);
    }
}