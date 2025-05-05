using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosisAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiagnosisId",
                table: "RxInfos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Diagnosis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DiagnosisText = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diagnosis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Diagnosis_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Diagnosis_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RxInfos_DiagnosisId",
                table: "RxInfos",
                column: "DiagnosisId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnosis_CreatedBy",
                table: "Diagnosis",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnosis_UpdatedBy",
                table: "Diagnosis",
                column: "UpdatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_RxInfos_Diagnosis_DiagnosisId",
                table: "RxInfos",
                column: "DiagnosisId",
                principalTable: "Diagnosis",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RxInfos_Diagnosis_DiagnosisId",
                table: "RxInfos");

            migrationBuilder.DropTable(
                name: "Diagnosis");

            migrationBuilder.DropIndex(
                name: "IX_RxInfos_DiagnosisId",
                table: "RxInfos");

            migrationBuilder.DropColumn(
                name: "DiagnosisId",
                table: "RxInfos");
        }
    }
}
