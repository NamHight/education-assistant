using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleHocBa.DTOs.Request;

public class RequestAddHocbaDto
{
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; }
    public string? MoTa { get; set; }
    public int LanHoc { get; set; } = 1;
    [Required(ErrorMessage = "Kết quả học tập không được để trống")]
    public int? KetQuaHocBaEnum { get; set; }
    [Required(ErrorMessage = "Id sinh viên không được để trống")]
    public Guid? SinhVienId { get; set; }
    [Required(ErrorMessage = "Id lớp học phần không được để trống")]
    public Guid? LopHocPhanId { get; set; }
    [Required(ErrorMessage = "Id chi tiết chương trình đào tạo không được để trống")]
    public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
}
public class RequestUpdateHocbaDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; }
    public string? MoTa { get; set; }
    public int LanHoc { get; set; } = 1;
    [Required(ErrorMessage = "Kết quả học tập không được để trống")]
    public int? KetQuaHocBaEnum { get; set; }
    [Required(ErrorMessage = "Id sinh viên không được để trống")]
    public Guid? SinhVienId { get; set; }
    [Required(ErrorMessage = "Id lớp học phần không được để trống")]
    public Guid? LopHocPhanId { get; set; }
    [Required(ErrorMessage = "Id chi tiết chương trình đào tạo không được để trống")]
    public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
}
