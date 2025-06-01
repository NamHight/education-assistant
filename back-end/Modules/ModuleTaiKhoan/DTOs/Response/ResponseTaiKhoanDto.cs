using System;
using System.ComponentModel.DataAnnotations;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;

public class ResponseTaiKhoanDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool Status { get; set; }
    public string LoaiTKhoan { get; set; } = string.Empty;
    public virtual GiangVien? GiangVien { get; set; }
}
