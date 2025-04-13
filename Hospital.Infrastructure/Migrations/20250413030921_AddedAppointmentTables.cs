using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Hospital.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedAppointmentTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalAssesments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChiefComplaint = table.Column<string>(type: "text", nullable: false),
                    HistoryOfIllness = table.Column<string>(type: "text", nullable: false),
                    Diagnosis = table.Column<string>(type: "text", nullable: false),
                    Advice = table.Column<string>(type: "text", nullable: false),
                    AppointmentInfoId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalAssesments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalAssesments_AppointmentInfos_AppointmentInfoId",
                        column: x => x.AppointmentInfoId,
                        principalTable: "AppointmentInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicalAssesments_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicalAssesments_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicationPrescibed",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RxId = table.Column<int>(type: "integer", nullable: false),
                    ApplicationType = table.Column<string>(type: "text", nullable: false),
                    TimesPerDay = table.Column<int>(type: "integer", nullable: false),
                    DurationInDays = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Remarks = table.Column<string>(type: "text", nullable: true),
                    AppointmentInfoId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationPrescibed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationPrescibed_AppointmentInfos_AppointmentInfoId",
                        column: x => x.AppointmentInfoId,
                        principalTable: "AppointmentInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationPrescibed_RxInfos_RxId",
                        column: x => x.RxId,
                        principalTable: "RxInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationPrescibed_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationPrescibed_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SkinAnalysisTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkinAnalysisTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkinAnalysisTypes_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SkinAnalysisTypes_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SkinAnalyses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SkinAnalysisTypeId = table.Column<int>(type: "integer", nullable: false),
                    Analysis = table.Column<string>(type: "text", nullable: false),
                    IsAbnormal = table.Column<bool>(type: "boolean", nullable: false),
                    AppointmentInfoId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkinAnalyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkinAnalyses_AppointmentInfos_AppointmentInfoId",
                        column: x => x.AppointmentInfoId,
                        principalTable: "AppointmentInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SkinAnalyses_SkinAnalysisTypes_SkinAnalysisTypeId",
                        column: x => x.SkinAnalysisTypeId,
                        principalTable: "SkinAnalysisTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SkinAnalyses_UserInfos_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SkinAnalyses_UserInfos_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "UserInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalAssesments_AppointmentInfoId",
                table: "MedicalAssesments",
                column: "AppointmentInfoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalAssesments_CreatedBy",
                table: "MedicalAssesments",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalAssesments_UpdatedBy",
                table: "MedicalAssesments",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescibed_AppointmentInfoId",
                table: "MedicationPrescibed",
                column: "AppointmentInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescibed_CreatedBy",
                table: "MedicationPrescibed",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescibed_RxId",
                table: "MedicationPrescibed",
                column: "RxId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescibed_UpdatedBy",
                table: "MedicationPrescibed",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalyses_AppointmentInfoId",
                table: "SkinAnalyses",
                column: "AppointmentInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalyses_CreatedBy",
                table: "SkinAnalyses",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalyses_SkinAnalysisTypeId",
                table: "SkinAnalyses",
                column: "SkinAnalysisTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalyses_UpdatedBy",
                table: "SkinAnalyses",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalysisTypes_CreatedBy",
                table: "SkinAnalysisTypes",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SkinAnalysisTypes_UpdatedBy",
                table: "SkinAnalysisTypes",
                column: "UpdatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalAssesments");

            migrationBuilder.DropTable(
                name: "MedicationPrescibed");

            migrationBuilder.DropTable(
                name: "SkinAnalyses");

            migrationBuilder.DropTable(
                name: "SkinAnalysisTypes");
        }
    }
}
