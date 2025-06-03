using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;

namespace Education_assistant.Modules.ModuleTruong.DTOs.Response;

public class ResponseTruongDto
{
    public string Id { get; set; } = string.Empty;
    public string MaTruong { get; set; } = string.Empty;
    public string TenTruong { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ViTri { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ICollection<ResponseKhoaDto>? DanhSachKhoa { get; set; }
}
