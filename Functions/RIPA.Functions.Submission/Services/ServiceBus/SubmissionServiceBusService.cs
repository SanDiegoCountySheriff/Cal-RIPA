using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.ServiceBus
{
    public class SubmissionServiceBusService : ISubmissionServiceBusService
    {
        private readonly ServiceBusClient _serviceBusClient;
        private const int batchMessageCountLimit = 250;
        private readonly ILogger _log;

        ServiceBusClient ISubmissionServiceBusService.SubmissionServiceBusClient { get { return _serviceBusClient; } }

        public SubmissionServiceBusService(string serviceBusConnection, string queueName, ILogger log)
        {
            _serviceBusClient = new ServiceBusClient(serviceBusConnection);
            _log = log;
        }

        public class SubmissionMessage
        {
            public string StopId { get; set; }
            public Guid SubmissionId { get; set; }
        }

        public async Task<IReadOnlyList<ServiceBusReceivedMessage>> ReceiveMessagesAsync(ServiceBusReceiver serviceBusReceiver)
        {
            return await serviceBusReceiver.ReceiveMessagesAsync(batchMessageCountLimit, new TimeSpan(0, 0, 5));
        }

        public async Task SendServiceBusMessagesAsync(List<ServiceBusMessage> listServiceBusMessages)
        {
            try
            {
                ServiceBusSender serviceBusSender = _serviceBusClient.CreateSender("submission");
                _log.LogInformation($"Sending {listServiceBusMessages.Count} messages");
                ServiceBusMessageBatch messageBatch = await serviceBusSender.CreateMessageBatchAsync();
                int batchMessageCount = 0;
                foreach (ServiceBusMessage serviceBusMessage in listServiceBusMessages)
                {

                    if (!messageBatch.TryAddMessage(serviceBusMessage))
                    {
                        // if it is too large for the batch
                        _log.LogError("$The message { i} is too large to fit in the batch.");
                        throw new Exception($"The message {serviceBusMessage.Body} is too large to fit in the batch.");
                    }
                    batchMessageCount++;

                    if (batchMessageCount >= batchMessageCountLimit)
                    {
                        // Use the producer client to send the batch of messages to the Service Bus queue
                        await serviceBusSender.SendMessagesAsync(messageBatch);
                        _log.LogInformation($"A batch of {batchMessageCount} messages has been published to the queue.");
                        messageBatch.Dispose();
                        messageBatch = await serviceBusSender.CreateMessageBatchAsync();
                        batchMessageCount = 0;
                    }
                }
                await serviceBusSender.SendMessagesAsync(messageBatch);
                messageBatch.Dispose();
                _log.LogInformation($"A batch of {batchMessageCount} messages has been published to the queue.");

            }
            catch (Exception ex)
            {
                _log.LogError("error occurred", ex);
            }
        }
    }
}