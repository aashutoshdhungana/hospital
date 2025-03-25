using Hospital.Application.Constants;
using Hospital.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Hospital.Infrastructure.Services
{
    public class SMSService : ISMSService
    {
        private readonly ILogger<SMSService> _logger;
        public SMSService(ILogger<SMSService> logger)
        {
            _logger = logger;
        }
        public async Task<ResultTypes> SendSMSMessage(string message, string phoneNumber)
        {
            await Task.Delay(1000);
            _logger.LogInformation("Message {message} send to {phoneNumber}", message, phoneNumber);
            return ResultTypes.Success;
        }
    }
}
