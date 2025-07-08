using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Education_assistant.Migrations
{
    /// <inheritdoc />
    public partial class AddNganhCha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "nganh_cha_id",
                table: "nganh",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_nganh_nganh_cha_id",
                table: "nganh",
                column: "nganh_cha_id");

            migrationBuilder.AddForeignKey(
                name: "FK_nganh_nganh_nganh_cha_id",
                table: "nganh",
                column: "nganh_cha_id",
                principalTable: "nganh",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_nganh_nganh_nganh_cha_id",
                table: "nganh");

            migrationBuilder.DropIndex(
                name: "IX_nganh_nganh_cha_id",
                table: "nganh");

            migrationBuilder.DropColumn(
                name: "nganh_cha_id",
                table: "nganh");
        }
    }
}
