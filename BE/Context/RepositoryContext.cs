using Education_assistant.Models;
using Microsoft.EntityFrameworkCore;

namespace Education_assistant.Context;

public class RepositoryContext : DbContext
{
    public RepositoryContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<TaiKhoan>? TaiKhoans { get; set; }
    public DbSet<GiangVien>? GiangViens { get; set; }
    public DbSet<LopHoc>? LopHocs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaiKhoan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<GiangVien>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LopHoc>().HasQueryFilter(e => e.DeletedAt == null);

        base.OnModelCreating(modelBuilder);
    }
}