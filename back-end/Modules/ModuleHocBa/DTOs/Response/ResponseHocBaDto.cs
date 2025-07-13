using Education_assistant.Models;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;

namespace Education_assistant.Modules.ModuleHocBa.DTOs.Response;

public class ResponseHocBaDto
{
    public Guid Id { get; set; }
    public decimal DiemTongKet { get; set; }
    public string? MoTa { get; set; }
    public int? KetQua { get; set; }
    public Guid? SinhVienId { get; set; }
    public SinhVienSimpleDto? SinhVien { get; set; }
    public Guid? LopHocPhanId { get; set; }
    public LopHocPhanSimpleDto? LopHocPhan { get; set; }
    public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
    public ChiTietChuongTrinhDaoTaoSimpleDto? ChiTietChuongTrinhDaoTao { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class HocBaSimpleDto
{
    public Guid Id { get; set; }
    public decimal DiemTongKet { get; set; }
}

public class ResponseHocBaSummaryDto
{
    public IEnumerable<ResponseHocBaDto>? ListHocBa { get; set; }
    public decimal? GPA { get; set; }
}

public class ResponseHocBaProfileDto
{
    public SinhVienSimpleWithLopHocDto? SinhVien { get; set; }
    public int HocKy { get; set; }
    public List<HocBa> ListHocBa { get; set; } = new();

    public decimal? DiemTongKet { get; set; }
}