using Hospital.Domain.Aggregates.UserInfo;
using Microsoft.AspNetCore.Identity;

namespace Hospital.Infrastructure.Identity.Models
{
    public class User : IdentityUser
    {
        public int UserInfoId { get; set; }
        public bool IsPhoneNumberConfirmed { get; set; }
        public UserInfo UserInfo { get; set; } = null!;
        public void AddUserInfo(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException("UserInfo cannot be null");
            UserInfo = userInfo;
        }
    }
}
