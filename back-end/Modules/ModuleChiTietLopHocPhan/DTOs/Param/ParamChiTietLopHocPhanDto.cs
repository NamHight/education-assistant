using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;

public class ParamChiTietLopHocPhanDto : BaseParam
{
    public Guid lopHocPhanId { get; set; }
    public bool ngayNopDiem { get; set; } = true;
}

public class ParamChiTietLopHocPhanSimpleDto
{
    public string search { get; set; } = string.Empty;
}

