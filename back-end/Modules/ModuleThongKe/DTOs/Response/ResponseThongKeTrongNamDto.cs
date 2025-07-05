using System;

namespace Education_assistant.Modules.ModuleThongKe.DTOs.Response;

public class ResponseThongKeTrongNamDto
{
    public int Key { get; set; }
    public double Value { get; set; }
    public string Label { get; set; } = string.Empty;
}
