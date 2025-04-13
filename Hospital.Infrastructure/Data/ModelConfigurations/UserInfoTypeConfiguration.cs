using Hospital.Domain.Aggregates.UserInfo;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.VisualBasic;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public class UserInfoTypeConfiguration : IEntityTypeConfiguration<UserInfo>
    {
        public void Configure(EntityTypeBuilder<UserInfo> builder)
        {
            builder.HasIndex(x => x.PhoneNumber)
                .IsUnique();

            builder.HasIndex(x => x.Email)
                .IsUnique();
            
            builder.OwnsOne(x => x.Address,
                sa =>
                {
                    sa.Property(p => p.Street).HasColumnName("Street");
                    sa.Property(p => p.City).HasColumnName("City");
                    sa.Property(p => p.State).HasColumnName("State");
                    sa.Property(p => p.Country).HasColumnName("Country");
                });
            
            builder.Property(p => p.DateOfBirth)
                .HasColumnType("timestamp without time zone");

            builder
                .HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey("CreatedBy")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            builder
                .HasOne(x => x.UpdatedByUser)
                .WithMany()
                .HasForeignKey("UpdatedBy")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
        }
    }
}
