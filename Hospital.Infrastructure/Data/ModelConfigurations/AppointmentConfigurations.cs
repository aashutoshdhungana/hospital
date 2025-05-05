using Hospital.Domain.Aggregates.Appointment;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public class AppointmentConfigurations : IEntityTypeConfiguration<AppointmentInfo>
    {
        public void Configure(EntityTypeBuilder<AppointmentInfo> builder)
        {
            builder.HasOne(x => x.MedicalAssesment)
                 .WithOne(x => x.AppointmentInfo)
                 .HasForeignKey<MedicalAssesment>(x => x.AppointmentInfoId)
                 .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.SkinAnalyses)
                .WithOne(x => x.AppointmentInfo)
                .HasForeignKey(x => x.AppointmentInfoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.MedicationPrescibed)
                .WithOne(x => x.AppointmentInfo)
                .HasForeignKey(x => x.AppointmentInfoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.DiagnosisInfos)
                .WithOne(x => x.AppointmentInfo)
                .HasForeignKey(x => x.ApointmentInfoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class SkinAnalysisConfigurations : IEntityTypeConfiguration<SkinAnalysis>
    {
        public void Configure(EntityTypeBuilder<SkinAnalysis> builder)
        {
            builder.HasOne(x => x.SkinAnalysisType)
                .WithMany(x => x.SkinAnalyses)
                .HasForeignKey(x => x.SkinAnalysisTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class MedicationPrescribed : IEntityTypeConfiguration<MedicationPrescibed>
    {
        public void Configure(EntityTypeBuilder<MedicationPrescibed> builder)
        {
            builder.HasOne(x => x.RxInfo)
                .WithMany(x => x.MedicationPrescibed)
                .HasForeignKey(x => x.RxId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
