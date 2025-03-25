using Hospital.Application.Constants;

namespace Hospital.Application.Interfaces
{
    public interface ISMSService
    {
        Task<ResultTypes> SendSMSMessage(string message, string phoneNumber);
    }
}
