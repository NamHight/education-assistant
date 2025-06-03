using System;
using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModuleSinhVien.Repositories;

public class RepositorySinhVien : RepositoryBase<SinhVien>, IRepositorySinhVien
{
    public RepositorySinhVien(RepositoryContext context) : base(context)
    {
    }

    public async Task CreateAsync(SinhVien sinhVien)
    {
        await Create(sinhVien);
    }

    public void DeleteSinhVien(SinhVien sinhVien)
    {
        Delete(sinhVien);
    }

    public async Task<PagedListAsync<SinhVien>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            var sinhviens = FindByCondition(item => item.HoTen.Contains(search), false);
            return await PagedListAsync<SinhVien>.ToPagedListAsync(sinhviens, page, limit);
        }
        return await PagedListAsync<SinhVien>.ToPagedListAsync(_context.SinhViens!, page, limit);
    }

    public async Task<SinhVien?> GetSinhVienByIdAsync(Guid id, bool trackChanges)
    {
        return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
    }

    public void UpdateSinhVien(SinhVien sinhVien)
    {
        Update(sinhVien);
    }
}
