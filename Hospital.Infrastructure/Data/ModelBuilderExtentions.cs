using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Hospital.Infrastructure.Data
{
    public static class ModelBuilderExtentions
    {
        public static ModelBuilder ConfigureSoftDelteQueryFilter(this ModelBuilder builder)
        {
            var softDeletableEntities = builder.Model.GetEntityTypes()
                .Where(t => typeof(ISoftDeletable).IsAssignableFrom(t.ClrType) && t.ClrType != typeof(ISoftDeletable)
                && !t.IsOwned());
            foreach (var entityType in softDeletableEntities)
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));
                var condition = Expression.Equal(property, Expression.Constant(false));
                var lambda = Expression.Lambda(condition, parameter);

                builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
            return builder;
        }

        public static ModelBuilder ConfigureCreatedByAndUpdatedByRelationship(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;

                if (clrType == typeof(UserInfo))
                    continue;

                if (!clrType.IsAbstract &&
                    clrType.BaseType != null &&
                    clrType.BaseType.IsGenericType &&
                    clrType.BaseType.GetGenericTypeDefinition() == typeof(AuditedEntity<>))
                {
                    builder.Entity(clrType)
                        .HasOne(typeof(UserInfo), "CreatedByUser")
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(true);

                    builder.Entity(clrType)
                        .HasOne(typeof(UserInfo), "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedBy")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired(false);
                }
            }
            return builder;
        }
    }
}
