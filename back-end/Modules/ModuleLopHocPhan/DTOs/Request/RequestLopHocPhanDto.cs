using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;

public class RequestAddLopHocPhanDto
{
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }
    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThaiLopHocPhanEnum { get; set; } 

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid? MonHocId { get; set; }
    [Required(ErrorMessage = "Id giảng viên không được để trống")]
    public Guid? GiangVienId { get; set; }
}
public class RequestUpdateLopHocPhanDto
{
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }
    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThaiLopHocPhanEnum { get; set; } 

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid? MonHocId { get; set; }
    [Required(ErrorMessage = "Id giảng viên không được để trống")]
    public Guid? GiangVienId { get; set; }
}
