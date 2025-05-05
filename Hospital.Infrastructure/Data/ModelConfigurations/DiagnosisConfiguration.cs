using Hospital.Domain.Aggregates.Diagnosis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public class DiagnosisConfiguration : IEntityTypeConfiguration<DiagnosisInfo>
    {
        public void Configure(EntityTypeBuilder<DiagnosisInfo> builder)
        {
            builder
                .HasMany(d => d.Prescriptions)
                .WithOne(rx => rx.Diagnosis)
                .HasForeignKey(rx => rx.DiagnosisId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
