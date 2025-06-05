using Education_assistant.Context;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModulePhongHoc.Repositories
{
    public class RepositoryPhongHoc : RepositoryBase<PhongHoc>, IRepositoryPhongHoc
    {
        public RepositoryPhongHoc(RepositoryContext context) : base(context)
        {
        }

        public async Task CreateAsync(PhongHoc phongHoc)
        {
            await CreateAsync(phongHoc);
        }

        public void DeletePhongHoc(PhongHoc phongHoc)
        {
            Delete(phongHoc);
        }


        //Tìm theo tên phòng hoặc toà nhà
        public async Task<PagedListAsync<PhongHoc>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit, string search)
        {
            if (!string.IsNullOrEmpty(search))
            {
                var phongHocs = FindByCondition(item => item.TenPhong.Contains(search) || item.ToaNha.Contains(search), false);
                return await PagedListAsync<PhongHoc>.ToPagedListAsync(phongHocs, page, limit);
            }
            return await PagedListAsync<PhongHoc>.ToPagedListAsync(_context.PhongHocs!, page, limit);
        }

        public async Task<PhongHoc?> GetPhongHocByIdAsync(Guid id, bool trackChanges)
        {
            return await FindByCondition(item => item.Id == id, trackChanges).FirstOrDefaultAsync();
        }

        public void UpdatePhongHoc(PhongHoc phongHoc)
        {
            Update(phongHoc);
        }
    }
}
