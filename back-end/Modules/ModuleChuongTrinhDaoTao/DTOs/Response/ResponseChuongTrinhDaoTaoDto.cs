using System;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;

public class ResponseChuongTrinhDaoTaoDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string MaChuongTrinh { get; set; } = string.Empty;
    public string TenChuongTrinh { get; set; } = string.Empty;
    public int LoaiChuonTrinhDaoTao { get; set; }
    public int ThoiGianDaoTao { get; set; } 
    public string? MoTa { get; set; }
    public int TongSoTinChi { get; set; }
    public int? Khoa { get; set; }
    public Guid? NganhId { get; set; }
    public NganhSimpleDto? Nganh { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
public class ChuongTrinhDaoTaoSimpleDto
{
    public Guid Id { get; set; }
    public string MaChuongTrinh { get; set; } = string.Empty;
    public string TenChuongTrinh { get; set; } = string.Empty;
}