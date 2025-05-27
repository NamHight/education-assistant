using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Education_assistant.Models;

[NotMapped]
public abstract class BaseEntity
{
    [Key] [Column("id")] public Guid Id { get; set; } = Guid.NewGuid();

    [Column("created_at")] [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")] public DateTime? UpdatedAt { get; set; }

    [Column("deleted_at")] public DateTime? DeletedAt { get; set; }

    [NotMapped] public bool IsDeleted => DeletedAt != null;
}