using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleMonHoc.DTOs.Request;

public class RequestAddMonHocDto
{
    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; } = string.Empty;
    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; } = string.Empty;
    public Guid KhoaId { get; set; }   
}
public class RequestUpdateMonHocDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Tên môn học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên môn học không được quá 255 ký tự")]
    public string TenMonHoc { get; set; } = string.Empty;

    [MaxLength(255, ErrorMessage = "Mô tả không được quá 255 ký tự")]
    public string MoTa { get; set; } = string.Empty;
    public Guid KhoaId { get; set; }   
}
