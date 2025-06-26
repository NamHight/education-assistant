using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "hoc_phi",
                table: "chuong_trinh_dao_tao");

            migrationBuilder.AddColumn<int>(
                name: "loai-lop",
                table: "lop_hoc_phan",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "loai-lop",
                table: "lop_hoc_phan");

            migrationBuilder.AddColumn<decimal>(
                name: "hoc_phi",
                table: "chuong_trinh_dao_tao",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
