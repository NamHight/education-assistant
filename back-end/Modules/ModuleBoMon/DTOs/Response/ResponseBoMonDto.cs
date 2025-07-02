using System;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;

namespace Education_assistant.Modules.ModuleBoMon.DTOs.Response;

public class ResponseBoMonDto
{
    public Guid Id { get; set; }
    public string TenBoMon { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public Guid? KhoaId { get; set; }
    public KhoaSimpleDto? Khoa { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class BoMonSimpleDto
{
    public Guid Id { get; set; }
    public string TenBoMon { get; set; } = string.Empty;
}
public class BoMonSummaryDto
{
    public Guid Id { get; set; }
    public string TenBoMon { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public Guid? KhoaId { get; set; }
    public KhoaSimpleDto? Khoa { get; set; }
}