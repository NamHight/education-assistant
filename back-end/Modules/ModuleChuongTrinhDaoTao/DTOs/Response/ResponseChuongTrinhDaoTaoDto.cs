using System;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;

public class ResponseChuongTrinhDaoTaoDto
{
    public Guid Id { get; set; }
    public string MaChuongTrinh { get; set; } = string.Empty;
    public string TenChuongTrinh { get; set; } = string.Empty;
    public string LoaiChuongTrinh { get; set; } = string.Empty;
    public string ThoiGianDaoTao { get; set; } = string.Empty;
    public decimal HocPhi { get; set; }
    public string? MoTa { get; set; }
    public int TongSoTinChi { get; set; }
    public Guid? KhoaId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
