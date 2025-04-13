using Hospital.Domain.Interfaces;

namespace Hospital.Domain.BaseEntities
{
    public class SoftDeletable<T> : AuditedEntity<T>, ISoftDeletable
    {
        public bool IsDeleted { get; private set; }
        public int? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }
        public void Delete(int deletedBy)
        {
            DeletedBy = deletedBy;
            DeletedAt = DateTime.UtcNow;
            IsDeleted = true;
        }
    }
}
