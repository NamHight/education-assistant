using System;

namespace Education_assistant.Modules.ModuleBoMon.DTOs.Response;

public class ResponseBoMonDto
{
    public Guid Id { get; set; }
    public string TenMonHoc { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public Guid? KhoaId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
