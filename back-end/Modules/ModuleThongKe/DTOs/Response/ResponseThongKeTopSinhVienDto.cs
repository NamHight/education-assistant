using System;

namespace Education_assistant.Modules.ModuleThongKe.DTOs.Response;

public class ResponseThongKeTopSinhVienDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Khoa { get; set; } = string.Empty;
    public string AnhDaiDien { get; set; } = string.Empty;
    public decimal GPA { get; set; }
}
