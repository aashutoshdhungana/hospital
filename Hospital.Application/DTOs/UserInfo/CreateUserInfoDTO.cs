using Hospital.Domain.Aggregates.UserInfo;

namespace Hospital.Application.DTOs.UserInfo
{
    public class CreateUserInfoDTO
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public Gender Gender { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
