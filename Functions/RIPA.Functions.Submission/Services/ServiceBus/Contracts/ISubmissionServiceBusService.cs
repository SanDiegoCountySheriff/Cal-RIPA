using Azure.Messaging.ServiceBus;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.ServiceBus.Contracts
{
    public interface ISubmissionServiceBusService
    {
        public ServiceBusClient SubmissionServiceBusClient { get; }

        public Task SendServiceBusMessagesAsync(List<ServiceBusMessage> listServiceBusMessage);
        public Task<IReadOnlyList<ServiceBusReceivedMessage>> ReceiveMessagesAsync(ServiceBusReceiver serviceBusReceiver);

    }
}
