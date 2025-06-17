using System;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;

namespace Education_assistant.Modules.ModuleMonHoc.DTOs.Response;

public class ResponseMonHocDto
{
    public Guid Id { get; set; }
    public string MaMonHoc { get; set; } = string.Empty;
    public string TenMonHoc { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public Guid KhoaId { get; set; }
    public KhoaSimpleDto Khoa { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
public class MonHocSimpleDto
{
    public Guid Id { get; set; }
    public string MaMonHoc { get; set; } = string.Empty;
    public string TenMonHoc { get; set; } = string.Empty;
}