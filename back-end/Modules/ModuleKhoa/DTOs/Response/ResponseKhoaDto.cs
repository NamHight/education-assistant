using System;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleKhoa.DTOs.Response;

public class ResponseKhoaDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string TenKhoa { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ViTriPhong { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

}
public class KhoaSimpleDto
{
    public Guid Id { get; set; }
    public string TenKhoa { get; set; } = string.Empty;
}