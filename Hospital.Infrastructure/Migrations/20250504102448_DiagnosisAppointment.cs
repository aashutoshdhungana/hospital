using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosisAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "MedicalAssesments");

            migrationBuilder.CreateTable(
                name: "AppointmentDiagnosis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ApointmentInfoId = table.Column<int>(type: "integer", nullable: false),
                    DiagnosisInfoId = table.Column<int>(type: "integer", nullable: false),
                    Remarks = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentDiagnosis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId",
                        column: x => x.ApointmentInfoId,
                        principalTable: "AppointmentInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentDiagnosis_DiagnosisInfo_DiagnosisInfoId",
                        column: x => x.DiagnosisInfoId,
                        principalTable: "DiagnosisInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentDiagnosis_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentDiagnosis_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentDiagnosis_ApointmentInfoId",
                table: "AppointmentDiagnosis",
                column: "ApointmentInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentDiagnosis_CreatedBy",
                table: "AppointmentDiagnosis",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentDiagnosis_DiagnosisInfoId",
                table: "AppointmentDiagnosis",
                column: "DiagnosisInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentDiagnosis_UpdatedBy",
                table: "AppointmentDiagnosis",
                column: "UpdatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentDiagnosis");

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "MedicalAssesments",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
