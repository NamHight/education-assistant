using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleTuan.DTOs.Param;

public class ParamTuanDto : BaseParam
{
    public int namHoc { get; set; }
    public int vaoTuan { get; set; }
    public int denTuan { get; set; }
}
