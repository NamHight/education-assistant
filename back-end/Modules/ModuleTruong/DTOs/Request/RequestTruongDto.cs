using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleTruong.DTOs.Request;

public class RequestAddTruongDto
{
    [Required(ErrorMessage = "Key không được để trống")]
    [MaxLength(255, ErrorMessage = "Key không được quá 255 ký tự")]
    public string Key { get; set; } = string.Empty;

    [Required(ErrorMessage = "Value không được để trống")]
    [MaxLength(255, ErrorMessage = "Value không được quá 255 ký tự")]
    public string Value { get; set; } = string.Empty;
}
public class RequestUpdateTruongDto
{
    public string? Name { get; set; } = string.Empty;
    public IFormFile? File { get; set; }
}

public class RequestUpdateFileTruongDto
{
    [Required(ErrorMessage = "Mã trường không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "File không được để trống")]
    public IFormFile? File { get; set; }
}