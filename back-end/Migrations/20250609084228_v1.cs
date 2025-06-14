using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_khoa_truong_truong_id",
                table: "khoa");

            migrationBuilder.DropIndex(
                name: "IX_khoa_truong_id",
                table: "khoa");

            migrationBuilder.DropColumn(
                name: "truong_id",
                table: "khoa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "truong_id",
                table: "khoa",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_khoa_truong_id",
                table: "khoa",
                column: "truong_id");

            migrationBuilder.AddForeignKey(
                name: "FK_khoa_truong_truong_id",
                table: "khoa",
                column: "truong_id",
                principalTable: "truong",
                principalColumn: "id");
        }
    }
}
