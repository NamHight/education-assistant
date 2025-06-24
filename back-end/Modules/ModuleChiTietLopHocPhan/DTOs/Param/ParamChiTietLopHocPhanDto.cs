using System;
using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;

public class ParamChiTietLopHocPhanDto : BaseParam
{
    public int hocKy { get; set; }
    public Guid lopHocPhanId { get; set; }
    public int loaiMonHoc { get; set; }
    public int namHoc { get; set; }
    public Guid chuongTrinhDaoTaoId { get; set; }
    public bool ngayNopDiem { get; set; } = true;
}