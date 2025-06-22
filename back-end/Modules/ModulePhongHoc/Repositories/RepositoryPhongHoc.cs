using System.Linq.Expressions;
using Education_assistant.Context;
using Education_assistant.Extensions;
using Education_assistant.Models;
using Education_assistant.Repositories;
using Education_assistant.Repositories.Paginations;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Modules.ModulePhongHoc.Repositories
{
    public class RepositoryPhongHoc : RepositoryBase<PhongHoc>, IRepositoryPhongHoc
    {
        private string? sortByOder;

        public RepositoryPhongHoc(RepositoryContext context) : base(context)
        {
        }

        public async Task CreateAsync(PhongHoc phongHoc)
        {
            await Create(phongHoc);
        }

        public void DeletePhongHoc(PhongHoc phongHoc)
        {
            Delete(phongHoc);
        }

        public async Task<PagedListAsync<PhongHoc>> GetAllPhongHocAsync(int page, int limit, string search, string sortBy, string sortByOrder, int? trangThai)
        {
            var query = _context.PhongHocs!
                                .AsNoTracking()
                                .SearchBy(search, item => item.TenPhong)
                                .AsQueryable();
            if (trangThai.HasValue && trangThai != 0) {
                query = query.Where(item => item.TrangThaiPhongHoc == trangThai);
            }
            return await PagedListAsync<PhongHoc>.ToPagedListAsync(query
                                                                .SortByOptions(sortBy, sortByOrder, new Dictionary<string, Expression<Func<PhongHoc, object>>>
                                                                 {
                                                                     ["createdat"] = item => item.CreatedAt,
                                                                     ["updatedat"] = item => item.UpdatedAt!,
                                                                 })
                                                                , page, limit);
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
