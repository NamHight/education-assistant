using System;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Response;

public class ResponseLichKhoaBieuGiangVienDto
{
    public string TenLopHocPhan { get; set; } = string.Empty;
    public int? LoaiPhongHocEnum { get; set; }
    public int SiSo { get; set; }
    public string TenPhong { get; set; } = string.Empty;
    public int Thu { get; set; }
    public int? LoaiMonHocEnum { get; set; }
    public int TietBatDau { get; set; }
    public int TietKetThuc { get; set; }
    public Guid GiangVienId { get; set; }
    public Guid TuanId { get; set; }
    public Guid PhongId { get; set; }
    public Guid LopHocPhanId { get; set; } 
}
