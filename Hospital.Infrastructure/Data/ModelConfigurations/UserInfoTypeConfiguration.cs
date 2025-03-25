using Hospital.Domain.Aggregates.UserInfo;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public class UserInfoTypeConfiguration : IEntityTypeConfiguration<UserInfo>
    {
        public void Configure(EntityTypeBuilder<UserInfo> builder)
        {
            builder.HasAlternateKey(x => x.PhoneNumber);
            builder.OwnsOne(x => x.Address,
                sa =>
                {
                    sa.Property(p => p.Street).HasColumnName("Street");
                    sa.Property(p => p.City).HasColumnName("City");
                    sa.Property(p => p.State).HasColumnName("State");
                    sa.Property(p => p.Country).HasColumnName("Country");
                });
        }
    }
}
