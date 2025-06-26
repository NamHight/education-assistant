using System;

namespace Education_assistant.Modules.ModuleThongKe.DTOs.Param;

public class ParamCountPointThongKeDto
{
    public Guid lopHocPhanId { get; set; }
}

public class ParamTopStudentByClassThongKeDDto
{
    public int khoa { get; set; }
    public int hocKy { get; set; }
}