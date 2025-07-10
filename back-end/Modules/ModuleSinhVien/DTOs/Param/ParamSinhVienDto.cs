using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleSinhVien.DTOs.Param;

public class ParamSinhVienDto : BaseParam
{
    public Guid lopId { get; set; }
    public int tinhTrangHocTap { get; set; }
}

public class ParamSinhVienByLopHocPhanDto : BaseParam
{
    public Guid lopHocPhanId { get; set; }
}
