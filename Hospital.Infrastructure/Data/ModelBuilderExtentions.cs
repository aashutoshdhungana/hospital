using Hospital.Domain.BaseEntities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Hospital.Infrastructure.Data
{
    public static class ModelBuilderExtentions
    {
        public static void ConfigureSoftDelteQueryFilter(this ModelBuilder builder)
        {
            var softDeletableEntities = builder.Model.GetEntityTypes()
                .Where(t => typeof(SoftDeletable).IsAssignableFrom(t.ClrType) && t.ClrType != typeof(SoftDeletable)
                && !t.IsOwned());
            foreach (var entityType in softDeletableEntities)
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(SoftDeletable.IsDeleted));
                var condition = Expression.Equal(property, Expression.Constant(false));
                var lambda = Expression.Lambda(condition, parameter);

                builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }
    }
}
