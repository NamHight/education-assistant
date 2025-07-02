using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Param;

public class ParamLichBieuDto : BaseParam
{
    public Guid? giangVienId { get; set; }
    public Guid? tuanId { get; set; }
    public Guid? boMonId { get; set; }
}

public class ParamLichBieuSimpleDto
{
    public Guid? giangVienId { get; set; }
    public Guid? tuanId { get; set; }
    public Guid? boMonId { get; set; }
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
}