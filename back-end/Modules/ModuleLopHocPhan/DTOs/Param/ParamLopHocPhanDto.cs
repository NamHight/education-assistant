namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;

public class ParamLopHocPhanDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
    public int khoa { get; set; }
    public int loaiChuongTrinh { get; set; }
    public Guid chuongTrinhId { get; set; }
    public int hocKy { get; set; }
}