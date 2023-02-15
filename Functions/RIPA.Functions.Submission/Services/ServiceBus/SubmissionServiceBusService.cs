using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.ServiceBus;

public class SubmissionServiceBusService : ISubmissionServiceBusService
{
    private readonly ServiceBusClient _serviceBusClient;
    private readonly ServiceBusClientOptions _serviceBusClientOptions;
    private const int batchMessageCountLimit = 250;
    private readonly ILogger<SubmissionServiceBusService> _logger;

    ServiceBusClient ISubmissionServiceBusService.SubmissionServiceBusClient { get { return _serviceBusClient; } }

    public SubmissionServiceBusService(ILogger<SubmissionServiceBusService> logger)
    {
        _logger = logger;
        _serviceBusClientOptions = new ServiceBusClientOptions();
#if DEBUG
        _serviceBusClientOptions.TransportType = ServiceBusTransportType.AmqpWebSockets;
#endif
        _serviceBusClient = new ServiceBusClient(Environment.GetEnvironmentVariable("ServiceBusConnection"), _serviceBusClientOptions);
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
        ServiceBusSender serviceBusSender = _serviceBusClient.CreateSender("submission");
        _logger.LogInformation($"Sending {listServiceBusMessages.Count} messages");
        ServiceBusMessageBatch messageBatch = await serviceBusSender.CreateMessageBatchAsync();
        int batchMessageCount = 0;
        foreach (ServiceBusMessage serviceBusMessage in listServiceBusMessages)
        {

            if (!messageBatch.TryAddMessage(serviceBusMessage))
            {
                // if it is too large for the batch
                _logger.LogError($"The message {serviceBusMessage.Body} is too large to fit in the batch.");
                throw new Exception($"The message {serviceBusMessage.Body} is too large to fit in the batch.");
            }
            batchMessageCount++;

            if (batchMessageCount >= batchMessageCountLimit)
            {
                // Use the producer client to send the batch of messages to the Service Bus queue
                await serviceBusSender.SendMessagesAsync(messageBatch);
                _logger.LogInformation($"A batch of {batchMessageCount} messages has been published to the queue.");
                messageBatch.Dispose();
                messageBatch = await serviceBusSender.CreateMessageBatchAsync();
                batchMessageCount = 0;
            }
        }
        await serviceBusSender.SendMessagesAsync(messageBatch);
        messageBatch.Dispose();
        _logger.LogInformation($"A batch of {batchMessageCount} messages has been published to the queue.");
    }
}
