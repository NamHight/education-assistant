using System;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;

public class ParamAllDiemSoByLopHocDto
{
    public Guid LopHocPhanId { get; set; }  
    public int HocKy { get; set; }
    public int LoaiMonHoc { get; set; }
    public int NamHoc { get; set; }
    public Guid ChươngTrinhId { get; set; }  
}
