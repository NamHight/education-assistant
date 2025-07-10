using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class EditThoiGianDaoTao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
