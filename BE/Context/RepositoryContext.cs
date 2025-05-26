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
    public DbSet<ChuongTrinhDaoTao>? ChuongTrinhDaoTaos { get; set; }
    public DbSet<DangKyMonHoc>? DangKyMonHocs { get; set; }
    public DbSet<Khoa>? Khoas { get; set; }
    public DbSet<LopHocPhan>? LopHocPhans { get; set; }
    public DbSet<MonHoc>? MonHocs { get; set; }
    public DbSet<SinhVien>? SinhViens { get; set; }
    public DbSet<Truong>? Truongs { get; set; }
    public DbSet<HocBa>?  HocBas { get; set; }
    public DbSet<LichBieu>? LichBieus { get; set; }
    public DbSet<SinhVienChuongTrinhDaoTao>? SinhVienChuongTrinhDaoTaos { get; set; }
    public DbSet<ChiTietChuongTrinhDaoTao>? ChiTietChuongTrinhDaoTaos { get; set; }
    public DbSet<ChiTietLopHocPhan>? ChiTietLopHocPhans { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaiKhoan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<GiangVien>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LopHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<ChuongTrinhDaoTao>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<DangKyMonHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<Khoa>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LopHocPhan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<MonHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<SinhVien>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<Truong>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<ChiTietChuongTrinhDaoTao>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<ChiTietLopHocPhan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<HocBa>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LichBieu>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<SinhVienChuongTrinhDaoTao>().HasQueryFilter(e => e.DeletedAt == null);
        
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = Environment.GetEnvironmentVariable("CONNECTION_DATABASE_STRING");
        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException("Connection string is not set in environment variables.");
        optionsBuilder.UseMySql(
            connectionString,
            ServerVersion.Parse("8.0.30-mysql"));
    }
}