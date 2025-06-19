using System;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;

public class ParamChiTietLopHocPhanDto
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string SortBy { get; set; } = string.Empty;
    public string SortByOrder { get; set; } = string.Empty;
    public int HocKy { get; set; }
    public Guid LopHocPhanId { get; set; }
    public int LoaiMonHoc { get; set; }
    public int NamHoc { get; set; }
    public Guid ChuongTrinhId { get; set; }
}