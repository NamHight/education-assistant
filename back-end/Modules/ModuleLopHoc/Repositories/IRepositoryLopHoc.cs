using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLopHoc.Repositories;

public interface IRepositoryLopHoc
{
    Task<PagedListAsync<LopHoc>> GetAllLopHocAsync(int page, int limit, string search, string sortBy, string sortByOrder);  
    Task<LopHoc?> GetLopHocByIdAsync(Guid id, bool trackChanges);
    Task<IEnumerable<LopHoc>> GetLopHocByKhoaAndNganhIdAsync(int khoa, Guid nganhId);
    Task CreateAsync(LopHoc lopHoc);
    void UpdateLopHoc(LopHoc lopHoc);
    void DeleteLopHoc(LopHoc lopHoc);
}
