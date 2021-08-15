using Azure.Messaging.ServiceBus;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.ServiceBus.Contracts
{
    public interface IResultServiceBusService
    {
        public Task SendServiceBusMessagesAsync(List<ServiceBusMessage> listServiceBusMessage);
    }
}
