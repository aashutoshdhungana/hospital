using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedSoftDeletable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_UserInfos_PhoneNumber",
                table: "UserInfos");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "UserInfos");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "UserInfos");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "UserInfos");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "PatientInfos");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "PatientInfos");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PatientInfos");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "DoctorInfos");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "DoctorInfos");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorInfos");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "AppointmentInfos");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "AppointmentInfos");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AppointmentInfos");

            migrationBuilder.CreateIndex(
                name: "IX_UserInfos_Email",
                table: "UserInfos",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserInfos_PhoneNumber",
                table: "UserInfos",
                column: "PhoneNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserInfos_Email",
                table: "UserInfos");

            migrationBuilder.DropIndex(
                name: "IX_UserInfos_PhoneNumber",
                table: "UserInfos");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "UserInfos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "UserInfos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "UserInfos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "PatientInfos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "PatientInfos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PatientInfos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "DoctorInfos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "DoctorInfos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorInfos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "AppointmentInfos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "AppointmentInfos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AppointmentInfos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_UserInfos_PhoneNumber",
                table: "UserInfos",
                column: "PhoneNumber");
        }
    }
}
