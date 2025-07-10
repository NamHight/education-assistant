using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class removeThoiGianDaoTao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
