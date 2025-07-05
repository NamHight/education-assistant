using System;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;

public class ResponseLopHocPhanWithMonHocDto
{
    public Guid Id { get; set; }
    public string MaHocPhan { get; set; } = string.Empty;   
    public int SiSo { get; set; }
    public int? TrangThai { get; set; }
    public string? TenMonHoc { get; set; }
    public int? LoaiMonHoc { get; set; } 
    public Guid? MonHocId { get; set; }
    public Guid? GiangVienId { get; set; }
    public string? HoTen { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
