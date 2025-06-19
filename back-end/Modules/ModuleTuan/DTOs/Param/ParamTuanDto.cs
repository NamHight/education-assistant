using System;

namespace Education_assistant.Modules.ModuleTuan.DTOs.Param;

public class ParamTuanDto
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string SortBy { get; set; } = string.Empty;
    public string SortByOrder { get; set; } = string.Empty;
    public int NamHoc { get; set; }
    public int VaoTuan { get; set; }
    public int DenTuan { get; set; }
}
