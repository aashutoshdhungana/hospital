using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosisAppointmentUpdatess : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RxInfos_DiagnosisInfo_DiagnosisId",
                table: "RxInfos");

            migrationBuilder.AddForeignKey(
                name: "FK_RxInfos_DiagnosisInfo_DiagnosisId",
                table: "RxInfos",
                column: "DiagnosisId",
                principalTable: "DiagnosisInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RxInfos_DiagnosisInfo_DiagnosisId",
                table: "RxInfos");

            migrationBuilder.AddForeignKey(
                name: "FK_RxInfos_DiagnosisInfo_DiagnosisId",
                table: "RxInfos",
                column: "DiagnosisId",
                principalTable: "DiagnosisInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
