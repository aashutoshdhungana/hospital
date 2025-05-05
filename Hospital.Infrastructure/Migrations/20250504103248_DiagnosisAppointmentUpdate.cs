using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosisAppointmentUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId",
                table: "AppointmentDiagnosis");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId",
                table: "AppointmentDiagnosis",
                column: "ApointmentInfoId",
                principalTable: "AppointmentInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId",
                table: "AppointmentDiagnosis");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId",
                table: "AppointmentDiagnosis",
                column: "ApointmentInfoId",
                principalTable: "AppointmentInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
