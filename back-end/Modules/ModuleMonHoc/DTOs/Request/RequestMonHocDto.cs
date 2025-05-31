using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleMonHoc.DTOs.Request;

public class RequestAddMonHocDto
{
    [Required(ErrorMessage = "Mã môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string MaMonHoc { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }

    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số tiết không được để trống")]
    public int SoTiet { get; set; }
    public string LoaiMon { get; set; } = string.Empty;
    public Guid KhoaId { get; set; }   
}
public class RequestUpdateMonHocDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Mã môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã môn học không được quá 255 ký tự")]
    public string MaMonHoc { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số tín chỉ không được để trống")]
    public int SoTinChi { get; set; }

    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số tiết không được để trống")]
    public int SoTiet { get; set; }
    public string LoaiMon { get; set; } = string.Empty;
    public Guid KhoaId { get; set; }   
}
