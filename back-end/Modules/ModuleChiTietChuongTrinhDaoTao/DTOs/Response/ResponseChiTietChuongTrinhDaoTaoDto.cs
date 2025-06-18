using System;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;

public class ResponseChiTietChuongTrinhDaoTaoDto
{
    public Guid Id { get; set; }
    public Guid MonHocId { get; set; }
    public MonHocSimpleDto? MonHoc { get; set; }
    public Guid ChuongTrinhDaoTaoId { get; set; }
    public ChuongTrinhDaoTaoSimpleDto? ChuongTrinhDaoTao { get; set; }
    public Guid? BoMonId { get; set; }
    public BoMonSimpleDto? BoMon { get; set; }
    public int SoTinChi { get; set; }
    public int HocKy { get; set; }
    public bool DiemTichLuy { get; set; }
    public int LoaiMonHocEnum { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ChiTietChuongTrinhDaoTaoSimpleDto
{
    public Guid Id { get; set; }
    public ChuongTrinhDaoTaoSimpleDto? ChuongTrinhDaoTao { get; set; }
}