using System;

namespace Education_assistant.Modules.ModuleThongKe.DTOs.Response;

public class ResponseTopStudentRawDto
{
    public string MaHocPhan { get; set; } = string.Empty;
    public int MSSV { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public decimal DiemTongKet { get; set; }
}