using System;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Param;

public class ParamLichBieuDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
    public int? NamHoc { get; set; }
    public Guid? GiangVienId { get; set; }
    public Guid? TuanId { get; set; }
}
