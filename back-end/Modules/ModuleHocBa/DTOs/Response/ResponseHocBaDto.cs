using System;

namespace Education_assistant.Modules.ModuleHocBa.DTOs.Response;

public class ResponseHocBaDto
{
    public Guid Id { get; set; }
    public decimal DiemTongKet { get; set; }
    public string? MoTa { get; set; }
    public int LanHoc { get; set; } = 1;
    public int? KetQuaHocBaEnum { get; set; }
    public Guid? SinhVienId { get; set; }
    public Guid? LopHocPhanId { get; set; }
    public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
