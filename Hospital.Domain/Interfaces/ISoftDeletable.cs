namespace Hospital.Domain.Interfaces
{
    public interface ISoftDeletable
    {
        bool IsDeleted { get; }
        void Delete(int deletedBy);
    }
}
