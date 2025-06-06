﻿CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "AspNetRoles" (
    "Id" text NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text,
    CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);

CREATE TABLE "AspNetUsers" (
    "Id" text NOT NULL,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL,
    CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id")
);

CREATE TABLE "AspNetRoleClaims" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "RoleId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserClaims" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "UserId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
    CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserRoles" (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserTokens" (
    "UserId" text NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name"),
    CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");

CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" ("NormalizedName");

CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");

CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");

CREATE INDEX "EmailIndex" ON "AspNetUsers" ("NormalizedEmail");

CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" ("NormalizedUserName");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250314182300_InitialCreate', '9.0.3');

CREATE TABLE "UserInfos" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Email" text NOT NULL,
    "FirstName" text NOT NULL,
    "MiddleName" text NOT NULL,
    "LastName" text NOT NULL,
    "PhoneNumber" text NOT NULL,
    "Gender" integer NOT NULL,
    "Street" text NOT NULL,
    "City" text NOT NULL,
    "State" text NOT NULL,
    "Country" text NOT NULL,
    "DateOfBirth" timestamp with time zone NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "DeletedBy" integer,
    "DeletedAt" timestamp with time zone,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_UserInfos" PRIMARY KEY ("Id"),
    CONSTRAINT "AK_UserInfos_PhoneNumber" UNIQUE ("PhoneNumber")
);

CREATE TABLE "DoctorInfos" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "UserInfoId" integer NOT NULL,
    "Specialization" integer NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "DeletedBy" integer,
    "DeletedAt" timestamp with time zone,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_DoctorInfos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_DoctorInfos_UserInfos_UserInfoId" FOREIGN KEY ("UserInfoId") REFERENCES "UserInfos" ("Id") ON DELETE CASCADE
);

CREATE TABLE "PatientInfos" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "PatientId" integer GENERATED BY DEFAULT AS IDENTITY,
    "EmergencyContactPerson" text NOT NULL,
    "EmergencyContactNumber" text NOT NULL,
    "UserInfoId" integer NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "DeletedBy" integer,
    "DeletedAt" timestamp with time zone,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_PatientInfos" PRIMARY KEY ("Id"),
    CONSTRAINT "AK_PatientInfos_PatientId" UNIQUE ("PatientId"),
    CONSTRAINT "FK_PatientInfos_UserInfos_UserInfoId" FOREIGN KEY ("UserInfoId") REFERENCES "UserInfos" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AppointmentInfos" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "AppointmentDate" timestamp with time zone NOT NULL,
    "DoctorInfoId" integer NOT NULL,
    "PatientInfoId" integer NOT NULL,
    "Status" integer NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "DeletedBy" integer,
    "DeletedAt" timestamp with time zone,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_AppointmentInfos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AppointmentInfos_DoctorInfos_DoctorInfoId" FOREIGN KEY ("DoctorInfoId") REFERENCES "DoctorInfos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AppointmentInfos_PatientInfos_PatientInfoId" FOREIGN KEY ("PatientInfoId") REFERENCES "PatientInfos" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_AppointmentInfos_DoctorInfoId" ON "AppointmentInfos" ("DoctorInfoId");

CREATE INDEX "IX_AppointmentInfos_PatientInfoId" ON "AppointmentInfos" ("PatientInfoId");

CREATE INDEX "IX_DoctorInfos_UserInfoId" ON "DoctorInfos" ("UserInfoId");

CREATE INDEX "IX_PatientInfos_UserInfoId" ON "PatientInfos" ("UserInfoId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250323173144_doctorandpatientappointment', '9.0.3');

ALTER TABLE "AspNetUsers" ADD "IsPhoneNumberConfirmed" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "AspNetUsers" ADD "UserInfoId" integer NOT NULL DEFAULT 0;

CREATE INDEX "IX_AspNetUsers_UserInfoId" ON "AspNetUsers" ("UserInfoId");

ALTER TABLE "AspNetUsers" ADD CONSTRAINT "FK_AspNetUsers_UserInfos_UserInfoId" FOREIGN KEY ("UserInfoId") REFERENCES "UserInfos" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250323174108_useridentityupdates', '9.0.3');

ALTER TABLE "UserInfos" ALTER COLUMN "Email" DROP NOT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250324094706_EmailOptionalForUserInfo', '9.0.3');

ALTER TABLE "UserInfos" ALTER COLUMN "MiddleName" DROP NOT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250408185109_OptionalMiddleName', '9.0.3');

ALTER TABLE "DoctorInfos" ADD "MedicalLicenseNumber" text NOT NULL DEFAULT '';

ALTER TABLE "DoctorInfos" ADD "PastExperienceInYears" double precision NOT NULL DEFAULT 0.0;

CREATE INDEX "IX_UserInfos_CreatedBy" ON "UserInfos" ("CreatedBy");

CREATE INDEX "IX_UserInfos_UpdatedBy" ON "UserInfos" ("UpdatedBy");

CREATE INDEX "IX_PatientInfos_CreatedBy" ON "PatientInfos" ("CreatedBy");

CREATE INDEX "IX_PatientInfos_UpdatedBy" ON "PatientInfos" ("UpdatedBy");

CREATE INDEX "IX_DoctorInfos_CreatedBy" ON "DoctorInfos" ("CreatedBy");

CREATE INDEX "IX_DoctorInfos_UpdatedBy" ON "DoctorInfos" ("UpdatedBy");

CREATE INDEX "IX_AppointmentInfos_CreatedBy" ON "AppointmentInfos" ("CreatedBy");

CREATE INDEX "IX_AppointmentInfos_UpdatedBy" ON "AppointmentInfos" ("UpdatedBy");

ALTER TABLE "AppointmentInfos" ADD CONSTRAINT "FK_AppointmentInfos_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "AppointmentInfos" ADD CONSTRAINT "FK_AppointmentInfos_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "DoctorInfos" ADD CONSTRAINT "FK_DoctorInfos_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "DoctorInfos" ADD CONSTRAINT "FK_DoctorInfos_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "PatientInfos" ADD CONSTRAINT "FK_PatientInfos_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "PatientInfos" ADD CONSTRAINT "FK_PatientInfos_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "UserInfos" ADD CONSTRAINT "FK_UserInfos_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

ALTER TABLE "UserInfos" ADD CONSTRAINT "FK_UserInfos_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412091210_AuditedForeignKeyAdded', '9.0.3');

ALTER TABLE "UserInfos" ALTER COLUMN "CreatedBy" DROP NOT NULL;

ALTER TABLE "PatientInfos" ALTER COLUMN "CreatedBy" DROP NOT NULL;

ALTER TABLE "DoctorInfos" ALTER COLUMN "CreatedBy" DROP NOT NULL;

ALTER TABLE "AppointmentInfos" ALTER COLUMN "CreatedBy" DROP NOT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412110848_OptionalCreatedIdInUserInfo', '9.0.3');

ALTER TABLE "UserInfos" ALTER COLUMN "DateOfBirth" TYPE timestamp without time zone;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412141100_DobWithOutTimeZone', '9.0.3');

ALTER TABLE "UserInfos" DROP CONSTRAINT "AK_UserInfos_PhoneNumber";

ALTER TABLE "UserInfos" DROP COLUMN "DeletedAt";

ALTER TABLE "UserInfos" DROP COLUMN "DeletedBy";

ALTER TABLE "UserInfos" DROP COLUMN "IsDeleted";

ALTER TABLE "PatientInfos" DROP COLUMN "DeletedAt";

ALTER TABLE "PatientInfos" DROP COLUMN "DeletedBy";

ALTER TABLE "PatientInfos" DROP COLUMN "IsDeleted";

ALTER TABLE "DoctorInfos" DROP COLUMN "DeletedAt";

ALTER TABLE "DoctorInfos" DROP COLUMN "DeletedBy";

ALTER TABLE "DoctorInfos" DROP COLUMN "IsDeleted";

ALTER TABLE "AppointmentInfos" DROP COLUMN "DeletedAt";

ALTER TABLE "AppointmentInfos" DROP COLUMN "DeletedBy";

ALTER TABLE "AppointmentInfos" DROP COLUMN "IsDeleted";

CREATE UNIQUE INDEX "IX_UserInfos_Email" ON "UserInfos" ("Email");

CREATE UNIQUE INDEX "IX_UserInfos_PhoneNumber" ON "UserInfos" ("PhoneNumber");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412155106_RemovedSoftDeletable', '9.0.3');

UPDATE "PatientInfos" SET "CreatedBy" = 0 WHERE "CreatedBy" IS NULL;
ALTER TABLE "PatientInfos" ALTER COLUMN "CreatedBy" SET NOT NULL;
ALTER TABLE "PatientInfos" ALTER COLUMN "CreatedBy" SET DEFAULT 0;

UPDATE "DoctorInfos" SET "CreatedBy" = 0 WHERE "CreatedBy" IS NULL;
ALTER TABLE "DoctorInfos" ALTER COLUMN "CreatedBy" SET NOT NULL;
ALTER TABLE "DoctorInfos" ALTER COLUMN "CreatedBy" SET DEFAULT 0;

UPDATE "AppointmentInfos" SET "CreatedBy" = 0 WHERE "CreatedBy" IS NULL;
ALTER TABLE "AppointmentInfos" ALTER COLUMN "CreatedBy" SET NOT NULL;
ALTER TABLE "AppointmentInfos" ALTER COLUMN "CreatedBy" SET DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412160101_Updates', '9.0.3');

ALTER TABLE "UserInfos" ALTER COLUMN "Street" DROP NOT NULL;

ALTER TABLE "UserInfos" ALTER COLUMN "State" DROP NOT NULL;

ALTER TABLE "UserInfos" ALTER COLUMN "Country" DROP NOT NULL;

ALTER TABLE "UserInfos" ALTER COLUMN "City" DROP NOT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250412200616_UpdatesIDontRemember', '9.0.3');

CREATE TABLE "RxInfos" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Name" text NOT NULL,
    "Type" text NOT NULL,
    "Remarks" text,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RxInfos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RxInfos_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_RxInfos_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_RxInfos_CreatedBy" ON "RxInfos" ("CreatedBy");

CREATE INDEX "IX_RxInfos_UpdatedBy" ON "RxInfos" ("UpdatedBy");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250413001357_AddedRxInfoTable', '9.0.3');

CREATE TABLE "MedicalAssesments" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "ChiefComplaint" text NOT NULL,
    "HistoryOfIllness" text NOT NULL,
    "Diagnosis" text NOT NULL,
    "Advice" text NOT NULL,
    "AppointmentInfoId" integer NOT NULL,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_MedicalAssesments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_MedicalAssesments_AppointmentInfos_AppointmentInfoId" FOREIGN KEY ("AppointmentInfoId") REFERENCES "AppointmentInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_MedicalAssesments_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_MedicalAssesments_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "MedicationPrescibed" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "RxId" integer NOT NULL,
    "ApplicationType" text NOT NULL,
    "TimesPerDay" integer NOT NULL,
    "DurationInDays" integer NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "Remarks" text,
    "AppointmentInfoId" integer NOT NULL,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_MedicationPrescibed" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_MedicationPrescibed_AppointmentInfos_AppointmentInfoId" FOREIGN KEY ("AppointmentInfoId") REFERENCES "AppointmentInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_MedicationPrescibed_RxInfos_RxId" FOREIGN KEY ("RxId") REFERENCES "RxInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_MedicationPrescibed_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_MedicationPrescibed_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "SkinAnalysisTypes" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Name" text NOT NULL,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_SkinAnalysisTypes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_SkinAnalysisTypes_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_SkinAnalysisTypes_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "SkinAnalyses" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "SkinAnalysisTypeId" integer NOT NULL,
    "Analysis" text NOT NULL,
    "IsAbnormal" boolean NOT NULL,
    "AppointmentInfoId" integer NOT NULL,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_SkinAnalyses" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_SkinAnalyses_AppointmentInfos_AppointmentInfoId" FOREIGN KEY ("AppointmentInfoId") REFERENCES "AppointmentInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_SkinAnalyses_SkinAnalysisTypes_SkinAnalysisTypeId" FOREIGN KEY ("SkinAnalysisTypeId") REFERENCES "SkinAnalysisTypes" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_SkinAnalyses_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_SkinAnalyses_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "IX_MedicalAssesments_AppointmentInfoId" ON "MedicalAssesments" ("AppointmentInfoId");

CREATE INDEX "IX_MedicalAssesments_CreatedBy" ON "MedicalAssesments" ("CreatedBy");

CREATE INDEX "IX_MedicalAssesments_UpdatedBy" ON "MedicalAssesments" ("UpdatedBy");

CREATE INDEX "IX_MedicationPrescibed_AppointmentInfoId" ON "MedicationPrescibed" ("AppointmentInfoId");

CREATE INDEX "IX_MedicationPrescibed_CreatedBy" ON "MedicationPrescibed" ("CreatedBy");

CREATE INDEX "IX_MedicationPrescibed_RxId" ON "MedicationPrescibed" ("RxId");

CREATE INDEX "IX_MedicationPrescibed_UpdatedBy" ON "MedicationPrescibed" ("UpdatedBy");

CREATE INDEX "IX_SkinAnalyses_AppointmentInfoId" ON "SkinAnalyses" ("AppointmentInfoId");

CREATE INDEX "IX_SkinAnalyses_CreatedBy" ON "SkinAnalyses" ("CreatedBy");

CREATE INDEX "IX_SkinAnalyses_SkinAnalysisTypeId" ON "SkinAnalyses" ("SkinAnalysisTypeId");

CREATE INDEX "IX_SkinAnalyses_UpdatedBy" ON "SkinAnalyses" ("UpdatedBy");

CREATE INDEX "IX_SkinAnalysisTypes_CreatedBy" ON "SkinAnalysisTypes" ("CreatedBy");

CREATE INDEX "IX_SkinAnalysisTypes_UpdatedBy" ON "SkinAnalysisTypes" ("UpdatedBy");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250413030921_AddedAppointmentTables', '9.0.3');

ALTER TABLE "RxInfos" ADD "DiagnosisId" integer;

CREATE TABLE "Diagnosis" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "DiagnosisText" text NOT NULL,
    "Code" text,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Diagnosis" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Diagnosis_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Diagnosis_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_RxInfos_DiagnosisId" ON "RxInfos" ("DiagnosisId");

CREATE INDEX "IX_Diagnosis_CreatedBy" ON "Diagnosis" ("CreatedBy");

CREATE INDEX "IX_Diagnosis_UpdatedBy" ON "Diagnosis" ("UpdatedBy");

ALTER TABLE "RxInfos" ADD CONSTRAINT "FK_RxInfos_Diagnosis_DiagnosisId" FOREIGN KEY ("DiagnosisId") REFERENCES "Diagnosis" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250504033658_DiagnosisAdded', '9.0.3');

ALTER TABLE "RxInfos" DROP CONSTRAINT "FK_RxInfos_Diagnosis_DiagnosisId";

DROP TABLE "Diagnosis";

CREATE TABLE "DiagnosisInfo" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "DiagnosisText" text NOT NULL,
    "Code" text,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_DiagnosisInfo" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_DiagnosisInfo_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_DiagnosisInfo_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_DiagnosisInfo_CreatedBy" ON "DiagnosisInfo" ("CreatedBy");

CREATE INDEX "IX_DiagnosisInfo_UpdatedBy" ON "DiagnosisInfo" ("UpdatedBy");

ALTER TABLE "RxInfos" ADD CONSTRAINT "FK_RxInfos_DiagnosisInfo_DiagnosisId" FOREIGN KEY ("DiagnosisId") REFERENCES "DiagnosisInfo" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250504045519_DiagnosisUpdated', '9.0.3');

ALTER TABLE "MedicalAssesments" DROP COLUMN "Diagnosis";

CREATE TABLE "AppointmentDiagnosis" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "ApointmentInfoId" integer NOT NULL,
    "DiagnosisInfoId" integer NOT NULL,
    "Remarks" text,
    "CreatedBy" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedBy" integer,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_AppointmentDiagnosis" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId" FOREIGN KEY ("ApointmentInfoId") REFERENCES "AppointmentInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_AppointmentDiagnosis_DiagnosisInfo_DiagnosisInfoId" FOREIGN KEY ("DiagnosisInfoId") REFERENCES "DiagnosisInfo" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AppointmentDiagnosis_UserInfos_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_AppointmentDiagnosis_UserInfos_UpdatedBy" FOREIGN KEY ("UpdatedBy") REFERENCES "UserInfos" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_AppointmentDiagnosis_ApointmentInfoId" ON "AppointmentDiagnosis" ("ApointmentInfoId");

CREATE INDEX "IX_AppointmentDiagnosis_CreatedBy" ON "AppointmentDiagnosis" ("CreatedBy");

CREATE INDEX "IX_AppointmentDiagnosis_DiagnosisInfoId" ON "AppointmentDiagnosis" ("DiagnosisInfoId");

CREATE INDEX "IX_AppointmentDiagnosis_UpdatedBy" ON "AppointmentDiagnosis" ("UpdatedBy");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250504102448_DiagnosisAppointment', '9.0.3');

ALTER TABLE "AppointmentDiagnosis" DROP CONSTRAINT "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId";

ALTER TABLE "AppointmentDiagnosis" ADD CONSTRAINT "FK_AppointmentDiagnosis_AppointmentInfos_ApointmentInfoId" FOREIGN KEY ("ApointmentInfoId") REFERENCES "AppointmentInfos" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250504103248_DiagnosisAppointmentUpdate', '9.0.3');

ALTER TABLE "RxInfos" DROP CONSTRAINT "FK_RxInfos_DiagnosisInfo_DiagnosisId";

ALTER TABLE "RxInfos" ADD CONSTRAINT "FK_RxInfos_DiagnosisInfo_DiagnosisId" FOREIGN KEY ("DiagnosisId") REFERENCES "DiagnosisInfo" ("Id") ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250504113812_DiagnosisAppointmentUpdatess', '9.0.3');

COMMIT;

