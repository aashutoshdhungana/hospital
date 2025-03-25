using Hospital.Domain.Aggregates.Patient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public class PatientInfoTypeConfiguration
        : IEntityTypeConfiguration<PatientInfo>
    {
        public void Configure(EntityTypeBuilder<PatientInfo> builder)
        {
            builder.Property(x => x.PatientId)
                .ValueGeneratedOnAdd();
            builder.HasAlternateKey(x => x.PatientId);
        }
    }
}
