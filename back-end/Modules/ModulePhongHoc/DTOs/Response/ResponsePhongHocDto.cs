using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;

namespace Education_assistant.Modules.ModulePhongHoc.DTOs.Response;

public class ResponsePhongHocDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string TenPhong { get; set; } = string.Empty;
    public string ToaNha { get; set; } = string.Empty;
    public int SucChua { get; set; }
    public int LoaiPhongHoc { get; set; }
    public int TrangThaiPhongHoc { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
public class PhongHocSimpleDto
{
    public Guid Id { get; set; }
    public string TenPhong { get; set; } = string.Empty;
}

public class ResponsePhongHocAutoDto
{
    public List<string>? TenPhongs { get; set; }
    public string ToaNha { get; set; } = string.Empty;
    public int SucChua { get; set; }
    public int LoaiPhongHoc { get; set; }
    public int TrangThaiPhongHoc { get; set; }
}