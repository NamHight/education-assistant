using Education_assistant.Models;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Repositories.Paginations;
using Education_assistant.Services.BaseDtos;
using Microsoft.AspNetCore.Mvc;

namespace Education_assistant.Modules.ModuleGiangVien.Services;

public interface IServiceTaiKhoan
{
    Task ChangePassword(RequestChangePasswordDto request);
}