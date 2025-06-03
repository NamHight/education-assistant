using System;
using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLichBieu.Repositories;

public interface IRepositoryLichBieu
{
    Task<PagedListAsync<LichBieu>> GetAllPaginatedAndSearchOrSortAsync(int page, int limit);  
    Task<LichBieu?> GetLichBieuByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(LichBieu lichBieu);
    void UpdateLichBieu(LichBieu lichBieu);
    void DeleteLichBieu(LichBieu lichBieu);
}
