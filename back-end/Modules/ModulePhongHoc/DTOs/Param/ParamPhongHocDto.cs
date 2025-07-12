using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModulePhongHoc.DTOs.Param;

public class ParamPhongHocDto : BaseParam
{
    public string toaNha { get; set; } = string.Empty;
    public int trangThai { get; set; }
    public int loaiPhongHoc { get; set; }
}

