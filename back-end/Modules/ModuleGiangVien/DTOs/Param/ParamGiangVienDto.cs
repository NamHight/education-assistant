using System;

namespace Education_assistant.Modules.ModuleGiangVien.Dtos.Param;

public class ParamGiangVienDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
    public Guid? KhoaId { get; set; }
    public Guid? BoMonId { get; set; }
}
