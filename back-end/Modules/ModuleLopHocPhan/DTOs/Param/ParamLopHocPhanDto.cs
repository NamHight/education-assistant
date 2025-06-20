using System;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;

public class ParamLopHocPhanDto
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string SortBy { get; set; } = string.Empty;
    public string SortByOrder { get; set; } = string.Empty;
    public int Khoa { get; set; }
    public int LoaiChuongTrinh { get; set; }
    public Guid ChuongTrinhId { get; set; }
    public int HocKy { get; set; }
}
