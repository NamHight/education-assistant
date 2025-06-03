using System;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;

public class ResponseChiTietChuongTrinhDaoTaoDto
{
    public Guid Id { get; set; }
    public Guid MonHocId { get; set; }
    public Guid ChuongTrinhDaoTaoId { get; set; }
    public Guid? BoMonId { get; set; }
    public int SoTinChi { get; set; }
    public bool DiemTichLuy { get; set; }
    public string LoaiMon { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
