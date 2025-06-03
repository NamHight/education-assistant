using System;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;

namespace Education_assistant.Modules.ModuleKhoa.DTOs.Response;

public class ResponseKhoaDto
{
    public Guid Id { get; set; }
    public string TenKhoa { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ViTriPhong { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public Guid TruongId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

}
