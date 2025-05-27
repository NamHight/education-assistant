using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Models
{
    /// <inheritdoc />
    public partial class DatabaseCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "hoc_ky",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_hoc_ky = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_hoc_ky = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_bat_dau = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_ket_thuc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_bat_dau_dang_ky = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_ket_thuc_dang_ky = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    nam_hoc = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hoc_ky", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "truong",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_truong = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_truong = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vi_tri = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    website = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_truong", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "khoa",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_khoa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vi_tri_phong = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    website = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    truong_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_khoa", x => x.id);
                    table.ForeignKey(
                        name: "FK_khoa_truong_truong_id",
                        column: x => x.truong_id,
                        principalTable: "truong",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chuong_trinh_dao_tao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_chuong_trinh = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_chuong_trinh = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    loai_bang_cap = table.Column<int>(type: "int", nullable: true),
                    thoi_gian = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    hoc_phi = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    mo_ta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tong_so_tin_chi = table.Column<int>(type: "int", nullable: false),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chuong_trinh_dao_tao", x => x.id);
                    table.ForeignKey(
                        name: "FK_chuong_trinh_dao_tao_khoa_khoa_id",
                        column: x => x.khoa_id,
                        principalTable: "khoa",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "mon_hoc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_mon_hoc = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_mon_hoc = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_tin_chi = table.Column<int>(type: "int", nullable: false),
                    mo_ta = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_tiet = table.Column<int>(type: "int", nullable: false),
                    loai = table.Column<int>(type: "int", nullable: true),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mon_hoc", x => x.id);
                    table.ForeignKey(
                        name: "FK_mon_hoc_khoa_khoa_id",
                        column: x => x.khoa_id,
                        principalTable: "khoa",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuaTrinhCongTacs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    vi_tri = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    luong = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ngay_bat_dau = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_ket_thuc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    cong_tac = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuaTrinhCongTacs", x => x.id);
                    table.ForeignKey(
                        name: "FK_QuaTrinhCongTacs_giang_vien_giang_vien_id",
                        column: x => x.giang_vien_id,
                        principalTable: "giang_vien",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_QuaTrinhCongTacs_khoa_khoa_id",
                        column: x => x.khoa_id,
                        principalTable: "khoa",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "sinh_vien",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    mssv = table.Column<int>(type: "int", nullable: false),
                    cccd = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    anh_dai_dien = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ho_ten = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_sinh = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    gioi_tinh = table.Column<int>(type: "int", nullable: true),
                    dia_chi = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<int>(type: "int", nullable: true),
                    ngay_tot_nghiep = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_nhap_hoc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sinh_vien", x => x.id);
                    table.ForeignKey(
                        name: "FK_sinh_vien_chuong_trinh_dao_tao_dao_tao_id",
                        column: x => x.dao_tao_id,
                        principalTable: "chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_sinh_vien_lop_hoc_lop_hoc_id",
                        column: x => x.lop_hoc_id,
                        principalTable: "lop_hoc",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lop_hoc_phan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_hoc_phan = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    phong_hoc = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    si_so = table.Column<int>(type: "int", nullable: false),
                    trang_thai = table.Column<int>(type: "int", nullable: true),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    hoc_ky_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lop_hoc_phan", x => x.id);
                    table.ForeignKey(
                        name: "FK_lop_hoc_phan_giang_vien_giang_vien_id",
                        column: x => x.giang_vien_id,
                        principalTable: "giang_vien",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_lop_hoc_phan_hoc_ky_hoc_ky_id",
                        column: x => x.hoc_ky_id,
                        principalTable: "hoc_ky",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_lop_hoc_phan_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "mon_hoc_dao_tao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mon_hoc_dao_tao", x => x.id);
                    table.ForeignKey(
                        name: "FK_mon_hoc_dao_tao_chuong_trinh_dao_tao_dao_tao_id",
                        column: x => x.dao_tao_id,
                        principalTable: "chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_mon_hoc_dao_tao_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "diem_so",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    diem_chuyen_can = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    diem_trung_binh = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    diem_thi = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    diem_tong_ket = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ngay_them = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    hoc_ky_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diem_so", x => x.id);
                    table.ForeignKey(
                        name: "FK_diem_so_giang_vien_giang_vien_id",
                        column: x => x.giang_vien_id,
                        principalTable: "giang_vien",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_so_hoc_ky_hoc_ky_id",
                        column: x => x.hoc_ky_id,
                        principalTable: "hoc_ky",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_so_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_so_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ho_so_hoc_tap",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_nhap_hoc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_tot_nghiep = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    gpa = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    tin_chi = table.Column<int>(type: "int", nullable: false),
                    tinh_trang = table.Column<int>(type: "int", nullable: true),
                    tot_nghiep = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    chuong_trinh_dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ho_so_hoc_tap", x => x.id);
                    table.ForeignKey(
                        name: "FK_ho_so_hoc_tap_chuong_trinh_dao_tao_chuong_trinh_dao_tao_id",
                        column: x => x.chuong_trinh_dao_tao_id,
                        principalTable: "chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_ho_so_hoc_tap_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "dang_ky_mon_hoc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_dang_ky_hoc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    diem = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<int>(type: "int", nullable: true),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_phan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dang_ky_mon_hoc", x => x.id);
                    table.ForeignKey(
                        name: "FK_dang_ky_mon_hoc_lop_hoc_phan_lop_hoc_phan_id",
                        column: x => x.lop_hoc_phan_id,
                        principalTable: "lop_hoc_phan",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_dang_ky_mon_hoc_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "diem_tong",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    diem_tong_ket = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    mo_ta = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    loai = table.Column<int>(type: "int", nullable: true),
                    tin_chi = table.Column<int>(type: "int", nullable: false),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_phan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    hoc_ky_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diem_tong", x => x.id);
                    table.ForeignKey(
                        name: "FK_diem_tong_hoc_ky_hoc_ky_id",
                        column: x => x.hoc_ky_id,
                        principalTable: "hoc_ky",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_tong_lop_hoc_phan_lop_hoc_phan_id",
                        column: x => x.lop_hoc_phan_id,
                        principalTable: "lop_hoc_phan",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_tong_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_diem_tong_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_chuong_trinh_dao_tao_khoa_id",
                table: "chuong_trinh_dao_tao",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_dang_ky_mon_hoc_lop_hoc_phan_id",
                table: "dang_ky_mon_hoc",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_dang_ky_mon_hoc_sinh_vien_id",
                table: "dang_ky_mon_hoc",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_so_giang_vien_id",
                table: "diem_so",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_so_hoc_ky_id",
                table: "diem_so",
                column: "hoc_ky_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_so_mon_hoc_id",
                table: "diem_so",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_so_sinh_vien_id",
                table: "diem_so",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_tong_hoc_ky_id",
                table: "diem_tong",
                column: "hoc_ky_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_tong_lop_hoc_phan_id",
                table: "diem_tong",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_tong_mon_hoc_id",
                table: "diem_tong",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_diem_tong_sinh_vien_id",
                table: "diem_tong",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_ho_so_hoc_tap_chuong_trinh_dao_tao_id",
                table: "ho_so_hoc_tap",
                column: "chuong_trinh_dao_tao_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ho_so_hoc_tap_sinh_vien_id",
                table: "ho_so_hoc_tap",
                column: "sinh_vien_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_khoa_truong_id",
                table: "khoa",
                column: "truong_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_phan_giang_vien_id",
                table: "lop_hoc_phan",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_phan_hoc_ky_id",
                table: "lop_hoc_phan",
                column: "hoc_ky_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_phan_mon_hoc_id",
                table: "lop_hoc_phan",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_mon_hoc_khoa_id",
                table: "mon_hoc",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_mon_hoc_dao_tao_dao_tao_id",
                table: "mon_hoc_dao_tao",
                column: "dao_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_mon_hoc_dao_tao_mon_hoc_id",
                table: "mon_hoc_dao_tao",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_QuaTrinhCongTacs_giang_vien_id",
                table: "QuaTrinhCongTacs",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_QuaTrinhCongTacs_khoa_id",
                table: "QuaTrinhCongTacs",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_sinh_vien_dao_tao_id",
                table: "sinh_vien",
                column: "dao_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_sinh_vien_lop_hoc_id",
                table: "sinh_vien",
                column: "lop_hoc_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dang_ky_mon_hoc");

            migrationBuilder.DropTable(
                name: "diem_so");

            migrationBuilder.DropTable(
                name: "diem_tong");

            migrationBuilder.DropTable(
                name: "ho_so_hoc_tap");

            migrationBuilder.DropTable(
                name: "mon_hoc_dao_tao");

            migrationBuilder.DropTable(
                name: "QuaTrinhCongTacs");

            migrationBuilder.DropTable(
                name: "lop_hoc_phan");

            migrationBuilder.DropTable(
                name: "sinh_vien");

            migrationBuilder.DropTable(
                name: "hoc_ky");

            migrationBuilder.DropTable(
                name: "mon_hoc");

            migrationBuilder.DropTable(
                name: "chuong_trinh_dao_tao");

            migrationBuilder.DropTable(
                name: "khoa");

            migrationBuilder.DropTable(
                name: "truong");
        }
    }
}
