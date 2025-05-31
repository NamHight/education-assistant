using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleTaiKhoan.Repositories;

public class RepositoryTaiKhoan : RepositoryBase<TaiKhoan>, IRepositoryTaiKhoan
{
    public RepositoryTaiKhoan(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(TaiKhoan taiKhoan)
    {
        await Create(taiKhoan);
    }

    public void DeleteTaiKhoan(TaiKhoan taiKhoan)
    {
        Delete(taiKhoan);
    }

    public async Task<PagedListAsync<TaiKhoan>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
    {
         if (!string.IsNullOrEmpty(search))
        {
            var taiKhoans = FindByCondition(item => item.Email.Contains(search), false);
            return await PagedListAsync<TaiKhoan>.ToPagedListAsync(taiKhoans, page, limit);
        }
        return await PagedListAsync<TaiKhoan>.ToPagedListAsync(_context.TaiKhoans, page, limit);
    }

    public async Task<TaiKhoan?> GetTaiKhoanByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateTaiKhoan(TaiKhoan taiKhoan)
    {
        Update(taiKhoan);
    }
}
