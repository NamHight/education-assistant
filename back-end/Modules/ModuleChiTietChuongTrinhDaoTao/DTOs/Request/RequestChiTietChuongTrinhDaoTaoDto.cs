using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;

public class RequestAddChiTietChuongTrinhDaoTaoDto
{
    [Required(ErrorMessage = "Id môn học không được bỏ trống!")]
    public Guid MonHocId { get; set; }
    
    [Required(ErrorMessage = "Id chương trình đào tạo không được bỏ trống!")]
    public Guid ChuongTrinhDaoTaoId { get; set; }

    [Required(ErrorMessage = "Id bộ môn không được bỏ trống!")]
    public Guid BoMonId { get; set; }

    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }
    

    [Required(ErrorMessage = "Điểm tích lũy không được để trống")]
    public bool DiemTichLuy { get; set; }

    [Required(ErrorMessage = "Loại môn không được để trống")]
    public int? LoaiMonHocEnum { get; set; }
}
public class RequestUpdateChiTietChuongTrinhDaoTaoDto
{
    [Required(ErrorMessage = "Id không được bỏ trống!")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Id môn học không được bỏ trống!")]
    public Guid MonHocId { get; set; }

    [Required(ErrorMessage = "Id chương trình đào tạo không được bỏ trống!")]
    public Guid ChuongTrinhDaoTaoId { get; set; }

    [Required(ErrorMessage = "Id bộ môn không được bỏ trống!")]
    public Guid BoMonId { get; set; }

    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }
    [Required(ErrorMessage = "Học Kỳ không được để trống")]
    public int HocKy { get; set; }

    [Required(ErrorMessage = "Điểm tích lũy không được để trống")]
    public bool DiemTichLuy { get; set; }

    [Required(ErrorMessage = "Loại môn không được để trống")]
    public int? LoaiMonHocEnum { get; set; }
}
