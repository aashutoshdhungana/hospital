namespace Hospital.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        Task BeginTransaction();
        Task<bool> CommitTransaction();
        Task RollbackTransaction();
        Task<bool> CommitAsync();
    }
}