using Hospital.Domain.BaseEntities;
using Hospital.Domain.Exceptions;
using Hospital.Domain.Interfaces;

namespace Hospital.Domain.Aggregates.UserInfo
{
    public class UserInfo : AuditedEntity<int>, IAggregateRoot
    {
        // For EF Core
        private UserInfo() : base() { }

        public UserInfo(
            string email,
            string firstName,
            string middleName,
            string lastName,
            string phoneNumber,
            Gender gender,
            Address address,
            DateTime dateOfBirth,
            int? createdBy
            ) : base(createdBy)
        {
            Validate(firstName, lastName, phoneNumber, address, dateOfBirth);
            Email = email;
            FirstName = firstName;
            MiddleName = middleName;
            LastName = lastName;
            PhoneNumber = phoneNumber;
            Gender = gender;
            Address = address;
            DateOfBirth = dateOfBirth;
        }
        public string? Email { get; private set; }
        public string FirstName { get; private set; }
        public string? MiddleName { get; private set; }
        public string LastName { get; private set; }
        public string PhoneNumber { get; private set; }
        public Gender Gender { get; private set; }
        public Address Address { get; private set; }
        public DateTime DateOfBirth { get; private set; }
        public string FullName => $"{FirstName} {(string.IsNullOrWhiteSpace(MiddleName) ? "" : MiddleName[0] + ".")} {LastName}";
        public void Update(
            string email,
            string firstName,
            string middleName,
            string lastName,
            Gender gender,
            Address address,
            DateTime dateOfBirth,
            int updatedBy
            )
        {
            ValidateUpdate(firstName, lastName, address, dateOfBirth);

            Email = email;
            FirstName = firstName;
            MiddleName = middleName;
            LastName = lastName;
            Gender = gender;
            Address = address;
            DateOfBirth = dateOfBirth;
            Updated(updatedBy);
        }
        private void Validate(string firstName, string lastName, string phoneNumber, Address address, DateTime dateOfBirth)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new DomainException("First name is required.");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new DomainException("Last name is required.");

            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new DomainException("Phone number is required.");

            if (phoneNumber.Length != 10)
                throw new DomainException("Phone number must be 10 digits.");

            if (address == null)
                throw new DomainException("Address is required.");

            if (dateOfBirth >= DateTime.UtcNow)
                throw new DomainException("Date of birth must be in the past.");
        }

        private void ValidateUpdate(
            string firstName, 
            string lastName,  
            Address address, 
            DateTime dateOfBirth)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new DomainException("First name is required.");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new DomainException("Last name is required.");

            if (address == null)
                throw new DomainException("Address is required.");

            if (dateOfBirth >= DateTime.UtcNow)
                throw new DomainException("Date of birth must be in the past.");

        }
    }
}
