using System;

namespace Education_assistant.Modules.ModuleThongKe.DTOs.Response;

public class ResponsePassFailPointClassDto
{
    public string MaHocPhan { get; set; } = string.Empty;
    public int PassCount { get; set; }
    public int FailCount { get; set; }
}