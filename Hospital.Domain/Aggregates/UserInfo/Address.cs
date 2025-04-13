using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.UserInfo
{
    public class Address : ValueObject
    {
        public string? Street { get; }
        public string? City { get; }
        public string? State { get; }
        public string? Country { get; }

        public Address(string street, string city, string state, string country)
        {
            Street = street;
            City = city;
            State = state;
            Country = country;
        }
    }

}
