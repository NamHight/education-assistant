using System;

namespace Education_assistant.Modules.ModuleTuan.DTOs.Response;

public class ResponseTuanDto
{
    public Guid Id { get; set; }
    public int SoTuan { get; set; }
    public int NamHoc { get; set; }
    public DateTime? NgayBatDau { get; set; }
    public DateTime? NgayKetThuc { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
