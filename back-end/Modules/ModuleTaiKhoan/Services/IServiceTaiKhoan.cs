using System;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTaiKhoan.Services;

public interface IServiceTaiKhoan
{
    Task<(IEnumerable<ResponseTaiKhoanDto> data, PageInfo page)> GetAllPaginationAndSearchAsync(ParamPageAndSearchBaseDto paramBaseDto);
    Task<ResponseTaiKhoanDto> GetRoleByIdAsync(int id, bool trackChanges);
    Task UpdateStatusAsync(int id);
    Task<ResponseTaiKhoanDto> CreateAsync(RequestTaiKhoanDto request);
    Task UpdateAsync(int id, RequestTaiKhoanDto request);
    Task DeleteAsync(int id);
}
