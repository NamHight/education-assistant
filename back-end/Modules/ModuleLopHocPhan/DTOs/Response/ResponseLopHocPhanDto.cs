using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;

public class ResponseLopHocPhanDto
{
    public int STT { get; set; }
    public Guid Id { get; set; }
    public string MaHocPhan { get; set; } = string.Empty;
    public int SiSo { get; set; }
    public int TrangThai { get; set; }
    public int Loai { get; set; }
    public Guid? MonHocId { get; set; }
    public MonHocSimpleDto? MonHoc { get; set; }
    public Guid? GiangVienId { get; set; }
    public GiangVienSimpleDto? GiangVien { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class LopHocPhanSimpleDto
{
    public Guid Id { get; set; }
    public string MaHocPhan { get; set; } = string.Empty;
    public int SiSo { get; set; }
    public MonHocSimpleDto? MonHoc { get; set; }
    public GiangVienSimpleDto? GiangVien { get; set; }
}