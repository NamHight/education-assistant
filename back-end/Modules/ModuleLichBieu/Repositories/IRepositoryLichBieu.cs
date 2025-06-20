using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleLichBieu.Repositories;

public interface IRepositoryLichBieu
{
    Task<PagedListAsync<LichBieu>> GetAllLichBieuAsync(int page, int limit, string? search, string? sortBy, string? sortByOrder, int? namHoc, Guid? giangvienId, Guid? tuanId, Guid? boMonId);
    Task<LichBieu?> GetLichBieuByIdAsync(Guid id, bool trackChanges);
    Task CreateAsync(LichBieu lichBieu);
    void UpdateLichBieu(LichBieu lichBieu);
    void DeleteLichBieu(LichBieu lichBieu);
}
