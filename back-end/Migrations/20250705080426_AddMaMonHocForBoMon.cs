using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class AddMaMonHocForBoMon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "diem_tong_ket",
                table: "hoc_ba",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2);

            migrationBuilder.AddColumn<string>(
                name: "ma_bo_mon",
                table: "bo_mon",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ma_bo_mon",
                table: "bo_mon");

            migrationBuilder.AlterColumn<decimal>(
                name: "diem_tong_ket",
                table: "hoc_ba",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2,
                oldNullable: true);
        }
    }
}
