using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.BaseEntities;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Data.ModelConfigurations
{
    public static class GlobalConfigurations
    {
        public static ModelBuilder ConfigureCreatedByAndUpdatedByRelationship(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;

                if (!clrType.IsAbstract &&
                    clrType.BaseType != null &&
                    clrType.BaseType.IsGenericType &&
                    clrType.BaseType.GetGenericTypeDefinition() == typeof(AuditedEntity<>))
                {
                    builder.Entity(clrType)
                        .HasOne(typeof(UserInfo))
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Restrict);

                    builder.Entity(clrType)
                        .HasOne(typeof(UserInfo))
                        .WithMany()
                        .HasForeignKey("UpdatedBy")
                        .OnDelete(DeleteBehavior.Restrict);
                }
            }
            return builder;
        }
    }
}
