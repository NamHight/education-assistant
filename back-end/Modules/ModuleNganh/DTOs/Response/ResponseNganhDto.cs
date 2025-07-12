using Education_assistant.Modules.ModuleKhoa.DTOs.Response;

namespace Education_assistant.Modules.ModuleNganh.DTOs.Response;

public class ResponseNganhDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string MaNganh { get; set; } = string.Empty;
    public string TenNganh { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public Guid? NganhChaId { get; set; }
    public NganhSimpleDto? NganhCha { get; set; }
    public Guid? KhoaId { get; set; }
    public KhoaSimpleDto? Khoa { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class NganhSimpleDto
{
    public Guid Id { get; set; }
    public string MaNganh { get; set; } = string.Empty;
    public string TenNganh { get; set; } = string.Empty;
    public KhoaSimpleDto? Khoa { get; set; }
}