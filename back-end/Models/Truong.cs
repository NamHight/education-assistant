using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[Table("truong")]
public class Truong : BaseEntity
{
    [Column("key")]
    [Required(ErrorMessage = "Key không được để trống")]
    [MaxLength(255, ErrorMessage = "Key không được quá 255 ký tự")]
    public string Key { get; set; } = string.Empty;

    [Column("value")]
    [Required(ErrorMessage = "Value không được để trống")]
    [MaxLength(255, ErrorMessage = "Value không được quá 255 ký tự")]
    public string Value { get; set; } = string.Empty;
}