using Hospital.Application.Interfaces;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Patient;
using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Domain.BaseEntities;
using Hospital.Domain.Exceptions;
using Hospital.Domain.Interfaces;
using Hospital.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace Hospital.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User>, IUnitOfWork
{
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<ApplicationDbContext> _logger;
    private IDbContextTransaction? _currentTransaction;
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService,
        ILogger<ApplicationDbContext> logger) :
        base(options)
    {
        _currentUserService = currentUserService;
        _logger = logger;
    }


    public DbSet<UserInfo> UserInfos { get; set; }
    public DbSet<PatientInfo> PatientInfos { get; set; }
    public DbSet<DoctorInfo> DoctorInfos { get; set; }
    public DbSet<AppointmentInfo> AppointmentInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        builder.ConfigureSoftDelteQueryFilter();
        base.OnModelCreating(builder);
    }

    // save changes with softdelete
    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        SoftDelete();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public override int SaveChanges()
    {
        SoftDelete();
        return base.SaveChanges();
    }

    public async Task<bool> CommitAsync()
    {
        try
        {
            _ = await SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(
                ex,
                "Database update error occurred while saving changes. " +
                "Error Code: {ErrorCode}, Message: {ErrorMessage}",
                ex.HResult,
                ex.Message);

            if (ex.InnerException != null)
            {
                _logger.LogError(
                    ex.InnerException,
                    "Inner exception details: {InnerErrorMessage}",
                    ex.InnerException.Message);
            }
            return false;
        }
    }

    private void SoftDelete()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => (e.Entity is SoftDeletable) && e.State == EntityState.Deleted);

        foreach (var entry in entries)
        {
            var entity = (SoftDeletable)entry.Entity;

            if (!_currentUserService.UserId.HasValue)
                throw new DomainException("Unauthenticated user cannot perform delete operation.");

            entity.Delete(_currentUserService.UserId.Value);
            entry.State = EntityState.Modified;
        }
    }

    public async Task BeginTransaction()
    {
        if (_currentTransaction != null)
            return;
        _currentTransaction = await Database.BeginTransactionAsync();
    }

    public async Task<bool> CommitTransaction()
    {
        try
        {
            if (_currentTransaction != null)
                await _currentTransaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            await RollbackTransaction();
            _logger.LogError(
                ex,
                "Database update error occurred while commiting the transaction. " +
                "Error Code: {ErrorCode}, Message: {ErrorMessage}",
                ex.HResult,
                ex.Message);

            if (ex.InnerException != null)
            {
                _logger.LogError(
                    ex.InnerException,
                    "Inner exception details: {InnerErrorMessage}",
                    ex.InnerException.Message);
            }
            return false;
        }
        finally
        {
            await DisposeTransaction();
        }
    }

    public async Task RollbackTransaction()
    {
        try
        {
            await Database.RollbackTransactionAsync();
        }
        finally
        {
            await DisposeTransaction();
        }
    }

    private async Task DisposeTransaction()
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }
}
