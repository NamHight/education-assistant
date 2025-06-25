using System;

namespace Education_assistant.Modules.ModuleThongKe.Record;

public class PassFailPointRaw
{
    public string MaHocPhan { get; set; } = string.Empty;
    public int PassCount { get; set; }
    public int FailCount { get; set; }
}
