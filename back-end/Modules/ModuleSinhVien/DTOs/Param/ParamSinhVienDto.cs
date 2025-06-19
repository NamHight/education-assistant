using System;

namespace Education_assistant.Modules.ModuleSinhVien.DTOs.Param;

public class ParamSinhVienDto
{
   public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string SortBy { get; set; } = string.Empty;
    public string SortByOrder { get; set; } = string.Empty;
    public Guid? LopId { get; set; }
}
