using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;

public class ParamLopHocPhanDto : BaseParam
{
    public int khoa { get; set; }
    public int loaiChuongTrinh { get; set; }
    public Guid chuongTrinhId { get; set; }
    public int hocKy { get; set; }
    public int trangThai { get; set; }
}
