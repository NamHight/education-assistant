using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class InitialDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "phong_hoc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_phong = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    toa_nha = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    suc_chua = table.Column<int>(type: "int", nullable: false),
                    loai_phong = table.Column<int>(type: "int", nullable: true),
                    trang_thai = table.Column<int>(type: "int", nullable: true),
                    TrangThaiPhongHocEnum = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_phong_hoc", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tai_khoan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_dang_nhap = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    reset_token = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    reset_expires = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    trang_thai = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    loai_tai_khoan = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tai_khoan", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "truong",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    key = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    value = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
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
                name: "tuan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    so_tuan = table.Column<int>(type: "int", nullable: false),
                    nam_hoc = table.Column<int>(type: "int", nullable: false),
                    ngay_bat_dau = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_ket_thuc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tuan", x => x.id);
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
                name: "bo_mon",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_bo_mon = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bo_mon", x => x.id);
                    table.ForeignKey(
                        name: "FK_bo_mon_khoa_khoa_id",
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
                    mo_ta = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
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
                name: "nganh",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_nganh = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_nganh = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nganh", x => x.id);
                    table.ForeignKey(
                        name: "FK_nganh_khoa_khoa_id",
                        column: x => x.khoa_id,
                        principalTable: "khoa",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "giang_vien",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ho_ten = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    chuc_vu = table.Column<int>(type: "int", nullable: false),
                    gioi_tinh = table.Column<int>(type: "int", nullable: true),
                    ngay_sinh = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    cccd = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dia_chi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_vao_truong = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    trinh_do = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    chuyen_nganh = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    anh_dai_dien = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai_giang_vien = table.Column<int>(type: "int", nullable: true),
                    tai_khoan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    khoa_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    bo_mon_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_giang_vien", x => x.id);
                    table.ForeignKey(
                        name: "FK_giang_vien_bo_mon_bo_mon_id",
                        column: x => x.bo_mon_id,
                        principalTable: "bo_mon",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_giang_vien_khoa_khoa_id",
                        column: x => x.khoa_id,
                        principalTable: "khoa",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_giang_vien_tai_khoan_tai_khoan_id",
                        column: x => x.tai_khoan_id,
                        principalTable: "tai_khoan",
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
                    loai_chuong_trinh_dao_tao = table.Column<int>(type: "int", nullable: true),
                    thoi_gian_dao_tao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    hoc_phi = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tong_so_tin_chi = table.Column<int>(type: "int", nullable: false),
                    khoa = table.Column<int>(type: "int", nullable: true),
                    nganh_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chuong_trinh_dao_tao", x => x.id);
                    table.ForeignKey(
                        name: "FK_chuong_trinh_dao_tao_nganh_nganh_id",
                        column: x => x.nganh_id,
                        principalTable: "nganh",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lop_hoc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_lop_hoc = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    si_so = table.Column<int>(type: "int", nullable: false),
                    nam_hoc = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    nganh_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lop_hoc", x => x.id);
                    table.ForeignKey(
                        name: "FK_lop_hoc_giang_vien_giang_vien_id",
                        column: x => x.giang_vien_id,
                        principalTable: "giang_vien",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_lop_hoc_nganh_nganh_id",
                        column: x => x.nganh_id,
                        principalTable: "nganh",
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
                    si_so = table.Column<int>(type: "int", nullable: false),
                    trang_thai = table.Column<int>(type: "int", nullable: true),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
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
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_lop_hoc_phan_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_chuong_trinh_dao_tao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    chuong_trinh_dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    bo_mon_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    so_tin_chi = table.Column<int>(type: "int", nullable: false),
                    hoc_ky = table.Column<int>(type: "int", nullable: false),
                    diem_tich_luy = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    loai_mon_hoc = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chi_tiet_chuong_trinh_dao_tao", x => x.id);
                    table.ForeignKey(
                        name: "FK_chi_tiet_chuong_trinh_dao_tao_bo_mon_bo_mon_id",
                        column: x => x.bo_mon_id,
                        principalTable: "bo_mon",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_chi_tiet_chuong_trinh_dao_tao_chuong_trinh_dao_tao_chuong_tr~",
                        column: x => x.chuong_trinh_dao_tao_id,
                        principalTable: "chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_chi_tiet_chuong_trinh_dao_tao_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
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
                    trang_thai_sinh_vien = table.Column<int>(type: "int", nullable: true),
                    tinh_trang_hoc_tap = table.Column<int>(type: "int", nullable: true),
                    ngay_tot_nghiep = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_nhap_hoc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    lop_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sinh_vien", x => x.id);
                    table.ForeignKey(
                        name: "FK_sinh_vien_lop_hoc_lop_hoc_id",
                        column: x => x.lop_hoc_id,
                        principalTable: "lop_hoc",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lich_bieu",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    tiet_bat_dau = table.Column<int>(type: "int", nullable: false),
                    tiet_ket_thuc = table.Column<int>(type: "int", nullable: false),
                    thu = table.Column<int>(type: "int", nullable: false),
                    tuan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_phan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    phong_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lich_bieu", x => x.id);
                    table.ForeignKey(
                        name: "FK_lich_bieu_lop_hoc_phan_lop_hoc_phan_id",
                        column: x => x.lop_hoc_phan_id,
                        principalTable: "lop_hoc_phan",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_lich_bieu_phong_hoc_phong_hoc_id",
                        column: x => x.phong_hoc_id,
                        principalTable: "phong_hoc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_lich_bieu_tuan_tuan_id",
                        column: x => x.tuan_id,
                        principalTable: "tuan",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_lop_hoc_phan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    diem_chuyen_can = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    diem_trung_binh = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    diem_thi_1 = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    diem_thi_2 = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    diem_tong_ket_1 = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    diem_tong_ket_2 = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    ngay_luu_diem = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_nop_diem = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    hoc_ky = table.Column<int>(type: "int", nullable: false),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai_diem = table.Column<int>(type: "int", nullable: true),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    mon_hoc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    giang_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_phan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chi_tiet_lop_hoc_phan", x => x.id);
                    table.ForeignKey(
                        name: "FK_chi_tiet_lop_hoc_phan_giang_vien_giang_vien_id",
                        column: x => x.giang_vien_id,
                        principalTable: "giang_vien",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_chi_tiet_lop_hoc_phan_lop_hoc_phan_lop_hoc_phan_id",
                        column: x => x.lop_hoc_phan_id,
                        principalTable: "lop_hoc_phan",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_chi_tiet_lop_hoc_phan_mon_hoc_mon_hoc_id",
                        column: x => x.mon_hoc_id,
                        principalTable: "mon_hoc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_chi_tiet_lop_hoc_phan_sinh_vien_sinh_vien_id",
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
                    diem = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: true),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: true)
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
                name: "hoc_ba",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    diem_tong_ket = table.Column<decimal>(type: "decimal(2,2)", precision: 2, scale: 2, nullable: false),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    lan_hoc = table.Column<int>(type: "int", nullable: false),
                    ket_qua = table.Column<int>(type: "int", nullable: true),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    lop_hoc_phan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    chi_tiet_chuong_trinh_dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hoc_ba", x => x.id);
                    table.ForeignKey(
                        name: "FK_hoc_ba_chi_tiet_chuong_trinh_dao_tao_chi_tiet_chuong_trinh_d~",
                        column: x => x.chi_tiet_chuong_trinh_dao_tao_id,
                        principalTable: "chi_tiet_chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_hoc_ba_lop_hoc_phan_lop_hoc_phan_id",
                        column: x => x.lop_hoc_phan_id,
                        principalTable: "lop_hoc_phan",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_hoc_ba_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "sinh_vien_chuong_trinh_dao_tao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    sinh_vien_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    chuong_trinh_dao_tao_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sinh_vien_chuong_trinh_dao_tao", x => x.id);
                    table.ForeignKey(
                        name: "FK_sinh_vien_chuong_trinh_dao_tao_chuong_trinh_dao_tao_chuong_t~",
                        column: x => x.chuong_trinh_dao_tao_id,
                        principalTable: "chuong_trinh_dao_tao",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_sinh_vien_chuong_trinh_dao_tao_sinh_vien_sinh_vien_id",
                        column: x => x.sinh_vien_id,
                        principalTable: "sinh_vien",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_bo_mon_khoa_id",
                table: "bo_mon",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_chuong_trinh_dao_tao_bo_mon_id",
                table: "chi_tiet_chuong_trinh_dao_tao",
                column: "bo_mon_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_chuong_trinh_dao_tao_chuong_trinh_dao_tao_id",
                table: "chi_tiet_chuong_trinh_dao_tao",
                column: "chuong_trinh_dao_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_chuong_trinh_dao_tao_mon_hoc_id",
                table: "chi_tiet_chuong_trinh_dao_tao",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_lop_hoc_phan_giang_vien_id",
                table: "chi_tiet_lop_hoc_phan",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_lop_hoc_phan_lop_hoc_phan_id",
                table: "chi_tiet_lop_hoc_phan",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_lop_hoc_phan_mon_hoc_id",
                table: "chi_tiet_lop_hoc_phan",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_chi_tiet_lop_hoc_phan_sinh_vien_id",
                table: "chi_tiet_lop_hoc_phan",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_chuong_trinh_dao_tao_nganh_id",
                table: "chuong_trinh_dao_tao",
                column: "nganh_id");

            migrationBuilder.CreateIndex(
                name: "IX_dang_ky_mon_hoc_lop_hoc_phan_id",
                table: "dang_ky_mon_hoc",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_dang_ky_mon_hoc_sinh_vien_id",
                table: "dang_ky_mon_hoc",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_giang_vien_bo_mon_id",
                table: "giang_vien",
                column: "bo_mon_id");

            migrationBuilder.CreateIndex(
                name: "IX_giang_vien_khoa_id",
                table: "giang_vien",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_giang_vien_tai_khoan_id",
                table: "giang_vien",
                column: "tai_khoan_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_hoc_ba_chi_tiet_chuong_trinh_dao_tao_id",
                table: "hoc_ba",
                column: "chi_tiet_chuong_trinh_dao_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_hoc_ba_lop_hoc_phan_id",
                table: "hoc_ba",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_hoc_ba_sinh_vien_id",
                table: "hoc_ba",
                column: "sinh_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_khoa_truong_id",
                table: "khoa",
                column: "truong_id");

            migrationBuilder.CreateIndex(
                name: "IX_lich_bieu_lop_hoc_phan_id",
                table: "lich_bieu",
                column: "lop_hoc_phan_id");

            migrationBuilder.CreateIndex(
                name: "IX_lich_bieu_phong_hoc_id",
                table: "lich_bieu",
                column: "phong_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_lich_bieu_tuan_id",
                table: "lich_bieu",
                column: "tuan_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_giang_vien_id",
                table: "lop_hoc",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_nganh_id",
                table: "lop_hoc",
                column: "nganh_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_phan_giang_vien_id",
                table: "lop_hoc_phan",
                column: "giang_vien_id");

            migrationBuilder.CreateIndex(
                name: "IX_lop_hoc_phan_mon_hoc_id",
                table: "lop_hoc_phan",
                column: "mon_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_mon_hoc_khoa_id",
                table: "mon_hoc",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_nganh_khoa_id",
                table: "nganh",
                column: "khoa_id");

            migrationBuilder.CreateIndex(
                name: "IX_sinh_vien_lop_hoc_id",
                table: "sinh_vien",
                column: "lop_hoc_id");

            migrationBuilder.CreateIndex(
                name: "IX_sinh_vien_chuong_trinh_dao_tao_chuong_trinh_dao_tao_id",
                table: "sinh_vien_chuong_trinh_dao_tao",
                column: "chuong_trinh_dao_tao_id");

            migrationBuilder.CreateIndex(
                name: "IX_sinh_vien_chuong_trinh_dao_tao_sinh_vien_id",
                table: "sinh_vien_chuong_trinh_dao_tao",
                column: "sinh_vien_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "chi_tiet_lop_hoc_phan");

            migrationBuilder.DropTable(
                name: "dang_ky_mon_hoc");

            migrationBuilder.DropTable(
                name: "hoc_ba");

            migrationBuilder.DropTable(
                name: "lich_bieu");

            migrationBuilder.DropTable(
                name: "sinh_vien_chuong_trinh_dao_tao");

            migrationBuilder.DropTable(
                name: "chi_tiet_chuong_trinh_dao_tao");

            migrationBuilder.DropTable(
                name: "lop_hoc_phan");

            migrationBuilder.DropTable(
                name: "phong_hoc");

            migrationBuilder.DropTable(
                name: "tuan");

            migrationBuilder.DropTable(
                name: "sinh_vien");

            migrationBuilder.DropTable(
                name: "chuong_trinh_dao_tao");

            migrationBuilder.DropTable(
                name: "mon_hoc");

            migrationBuilder.DropTable(
                name: "lop_hoc");

            migrationBuilder.DropTable(
                name: "giang_vien");

            migrationBuilder.DropTable(
                name: "nganh");

            migrationBuilder.DropTable(
                name: "bo_mon");

            migrationBuilder.DropTable(
                name: "tai_khoan");

            migrationBuilder.DropTable(
                name: "khoa");

            migrationBuilder.DropTable(
                name: "truong");
        }
    }
}
