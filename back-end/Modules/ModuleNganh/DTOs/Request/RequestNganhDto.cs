using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleNganh.DTOs.Request;

public class RequestAddNganhDto
{
    [Required(ErrorMessage = "Tên ngành không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên ngành không được quá 255 ký tự")]
    public string TenNganh { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    [Required(ErrorMessage = "Id khoa không được để trống")]
    public Guid? KhoaId { get; set; }
    public Guid? NganhChaId { get; set; }
}
public class RequestUpdateNganhDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Tên ngành không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên ngành không được quá 255 ký tự")]
    public string TenNganh { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    [Required(ErrorMessage = "Id khoa không được để trống")]
    public Guid? KhoaId { get; set; }
    public Guid? NganhChaId { get; set; }
}