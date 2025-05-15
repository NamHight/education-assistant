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
    public DbSet<DiemSo>? DiemSos { get; set; }
    public DbSet<DiemTong>? DiemTongs { get; set; }
    public DbSet<HocKy>? hocKies { get; set; }
    public DbSet<HoSoHocTap>? HoSoHocTaps { get; set; }
    public DbSet<Khoa>? Khoas { get; set; }
    public DbSet<LopHocPhan>? LopHocPhans { get; set; }
    public DbSet<MonHoc>? MonHocs { get; set; }
    public DbSet<MonHocDaoTao>? MonHocDaoTaos { get; set; }
    public DbSet<QuaTrinhCongTac>? QuaTrinhCongTacs { get; set; }
    public DbSet<SinhVien>? SinhViens { get; set; }
    public DbSet<Truong>? Truongs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaiKhoan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<GiangVien>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LopHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<ChuongTrinhDaoTao>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<DangKyMonHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<DiemSo>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<DiemTong>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<HocKy>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<HoSoHocTap>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<Khoa>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<LopHocPhan>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<MonHoc>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<MonHocDaoTao>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<QuaTrinhCongTac>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<SinhVien>().HasQueryFilter(e => e.DeletedAt == null);
        modelBuilder.Entity<Truong>().HasQueryFilter(e => e.DeletedAt == null);

        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySql(
            "Server=mysql-9b0f82c-finsr8280-699e.l.aivencloud.com;Port=13062;Database=defaultdb;Uid=avnadmin;Pwd=AVNS_IFVW5PgZf1fPf36BdDw;",
            ServerVersion.Parse("8.0.30-mysql"));
    }
}