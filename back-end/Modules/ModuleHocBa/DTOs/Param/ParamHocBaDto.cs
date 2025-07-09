using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleHocBa.DTOs.Param;

public class ParamHocBaDto : BaseParam
{
    public Guid lopHocPhanId { get; set; }
    public Guid sinhVienId { get; set; }
}

public class ParamHocBaBySinhVienDto
{
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
    public string mssv { get; set; } = string.Empty;
}