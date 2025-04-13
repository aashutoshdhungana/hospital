using Hospital.Domain.Aggregates.UserInfo;

namespace Hospital.Domain.BaseEntities
{
    public class AuditedEntity<IdType> : Entity<IdType>
    {
        protected AuditedEntity() : base() { }
        public AuditedEntity(int? createdBy) : base()
        {
            CreatedBy = createdBy;
            CreatedAt = DateTime.UtcNow;
        }

        public int? CreatedBy { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public int? UpdatedBy { get; protected set; }
        public DateTime? UpdatedAt { get; protected set; }
        public UserInfo CreatedByUser { get; protected set; }
        public UserInfo UpdatedByUser { get; protected set; }

        protected void Updated(int updatedBy)
        {
            UpdatedBy = updatedBy;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
