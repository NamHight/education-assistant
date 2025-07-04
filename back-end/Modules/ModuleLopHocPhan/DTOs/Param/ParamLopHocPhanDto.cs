using Education_assistant.Services.BaseDtos;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Param;

public class ParamLopHocPhanDto : BaseParam
{
    public int khoa { get; set; }
    public int loaiChuongTrinhDaoTao { get; set; }
    public Guid chuongTrinhDaoTaoId { get; set; }
    public int hocKy { get; set; }
    public int trangThai { get; set; }
    public int loaiLopHoc { get; set; }
    public Guid giangVienId { get; set; }
}

public class ParamLopHocPhanSimpleDto
{
    public int loaiChuongTrinhDaoTao { get; set; }
    public int khoa { get; set; }
    public int hocKy { get; set; }
    public Guid giangVienId { get; set; }
}

public class ParamLopHocPhanForLichBieuDto
{
    public int hocKy { get; set; }
    public Guid lopHocId { get; set; }
}