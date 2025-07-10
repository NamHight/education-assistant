using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class addThoiGianDaoTao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "thoi_gian_dao_tao",
                table: "chuong_trinh_dao_tao");
        }
    }
}
