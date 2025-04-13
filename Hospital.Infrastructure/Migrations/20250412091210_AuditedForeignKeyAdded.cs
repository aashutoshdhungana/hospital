using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AuditedForeignKeyAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MedicalLicenseNumber",
                table: "DoctorInfos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "PastExperienceInYears",
                table: "DoctorInfos",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_UserInfos_CreatedBy",
                table: "UserInfos",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserInfos_UpdatedBy",
                table: "UserInfos",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PatientInfos_CreatedBy",
                table: "PatientInfos",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PatientInfos_UpdatedBy",
                table: "PatientInfos",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorInfos_CreatedBy",
                table: "DoctorInfos",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorInfos_UpdatedBy",
                table: "DoctorInfos",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentInfos_CreatedBy",
                table: "AppointmentInfos",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentInfos_UpdatedBy",
                table: "AppointmentInfos",
                column: "UpdatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentInfos_UserInfos_CreatedBy",
                table: "AppointmentInfos",
                column: "CreatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentInfos_UserInfos_UpdatedBy",
                table: "AppointmentInfos",
                column: "UpdatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorInfos_UserInfos_CreatedBy",
                table: "DoctorInfos",
                column: "CreatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorInfos_UserInfos_UpdatedBy",
                table: "DoctorInfos",
                column: "UpdatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientInfos_UserInfos_CreatedBy",
                table: "PatientInfos",
                column: "CreatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientInfos_UserInfos_UpdatedBy",
                table: "PatientInfos",
                column: "UpdatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserInfos_UserInfos_CreatedBy",
                table: "UserInfos",
                column: "CreatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserInfos_UserInfos_UpdatedBy",
                table: "UserInfos",
                column: "UpdatedBy",
                principalTable: "UserInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentInfos_UserInfos_CreatedBy",
                table: "AppointmentInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentInfos_UserInfos_UpdatedBy",
                table: "AppointmentInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorInfos_UserInfos_CreatedBy",
                table: "DoctorInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorInfos_UserInfos_UpdatedBy",
                table: "DoctorInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientInfos_UserInfos_CreatedBy",
                table: "PatientInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientInfos_UserInfos_UpdatedBy",
                table: "PatientInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_UserInfos_UserInfos_CreatedBy",
                table: "UserInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_UserInfos_UserInfos_UpdatedBy",
                table: "UserInfos");

            migrationBuilder.DropIndex(
                name: "IX_UserInfos_CreatedBy",
                table: "UserInfos");

            migrationBuilder.DropIndex(
                name: "IX_UserInfos_UpdatedBy",
                table: "UserInfos");

            migrationBuilder.DropIndex(
                name: "IX_PatientInfos_CreatedBy",
                table: "PatientInfos");

            migrationBuilder.DropIndex(
                name: "IX_PatientInfos_UpdatedBy",
                table: "PatientInfos");

            migrationBuilder.DropIndex(
                name: "IX_DoctorInfos_CreatedBy",
                table: "DoctorInfos");

            migrationBuilder.DropIndex(
                name: "IX_DoctorInfos_UpdatedBy",
                table: "DoctorInfos");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentInfos_CreatedBy",
                table: "AppointmentInfos");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentInfos_UpdatedBy",
                table: "AppointmentInfos");

            migrationBuilder.DropColumn(
                name: "MedicalLicenseNumber",
                table: "DoctorInfos");

            migrationBuilder.DropColumn(
                name: "PastExperienceInYears",
                table: "DoctorInfos");
        }
    }
}
