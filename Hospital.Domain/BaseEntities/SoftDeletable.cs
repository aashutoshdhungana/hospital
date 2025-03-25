namespace Hospital.Domain.BaseEntities
{
    public class SoftDeletable
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
