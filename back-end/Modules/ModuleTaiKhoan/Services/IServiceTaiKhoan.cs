using System;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTaiKhoan.Services;

public interface IServiceTaiKhoan
{
    Task<(IEnumerable<ResponseTaiKhoanDto> data, PageInfo page)> GetAllTaiKhoaAsync(ParamBaseDto paramBaseDto);
    Task<ResponseTaiKhoanDto> GetTaiKhoanByIdAsync(Guid id, bool trackChanges);
    Task UpdateStatusAsync(Guid id);
    Task<ResponseTaiKhoanDto> CreateAsync(RequestAddTaiKhoanDto request);
    Task UpdateAsync(Guid id, RequestUpdateTaiKhoanDto request);
    Task DeleteAsync(Guid id);
}
