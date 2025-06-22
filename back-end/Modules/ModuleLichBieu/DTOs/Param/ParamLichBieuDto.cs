using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Param;

public class ParamLichBieuDto : BaseParam
{
    public int? namHoc { get; set; }
    public Guid? giangVienId { get; set; }
    public Guid? tuanId { get; set; }
    public Guid? boMonId { get; set; }
}
